<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const isEditing = ref(false);
const productForm = ref({ name: "", quantity: 0, location: "" });
const selectedProductId = ref(null);
const isBarcodeModalOpen = ref(false);
const selectedSKU = ref("");
const barcodeUrl = ref("");

const config = useRuntimeConfig()

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${config.public.apiBase}/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    products.value = data;
  } catch (err) {
    error.value = "Gagal memuat data produk";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const openModal = (product = null) => {
  if (product) {
    isEditing.value = true;
    selectedProductId.value = product.ID;
    productForm.value = { ...product };
  } else {
    isEditing.value = false;
    selectedProductId.value = null;
    productForm.value = { name: "", quantity: 0, location: "" };
  }
  showModal.value = true;
};

const saveProduct = async () => {
  try {
    const token = localStorage.getItem("token");
    const url = isEditing.value
      ? `${config.public.apiBase}/products/${selectedProductId.value}`
      : `${config.public.apiBase}/products/`;
    const method = isEditing.value ? "put" : "post";
    await axios({ method, url, data: productForm.value, headers: { Authorization: `Bearer ${token}` } });
    showModal.value = false;
    fetchProducts();
  } catch (err) {
    console.error("Gagal menyimpan produk", err);
  }
};

const updateStock = async (id, change) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(`${config.public.apiBase}/products/${id}/stock`, { change }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  } catch (err) {
    console.error("Gagal memperbarui stok", err);
  }
};

const deleteProduct = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${config.public.apiBase}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  } catch (err) {
    console.error("Gagal menghapus produk", err);
  }
};

const openBarcodeModal = async (sku) => {
  try {
    selectedSKU.value = sku;
    const token = localStorage.getItem("token");
    const response = await axios.get(`${config.public.apiBase}/products/barcode/${sku}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(response.data);
    barcodeUrl.value = blobUrl;
    isBarcodeModalOpen.value = true;
  } catch (err) {
    console.error("Gagal memuat barcode", err);
  }
};

const printBarcode = async (sku) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${config.public.apiBase}/products/barcode/${sku}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(response.data);
    
    const newTab = window.open();
    newTab.document.write(`
      <html>
        <head>
          <title>Cetak Barcode</title>
          <style>
            body { text-align: center; padding: 20px; font-family: Arial, sans-serif; }
            img { max-width: 100%; height: auto; margin: 20px 0; }
            button { padding: 10px 20px; font-size: 16px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>Barcode Produk: ${sku}</h2>
          <img src="${blobUrl}" alt="Barcode">
          <br>
          <button onclick="window.print()">Print</button>
        </body>
      </html>
    `);
    newTab.document.close();
  } catch (err) {
    console.error("Gagal memuat barcode untuk dicetak", err);
  }
};

const exportCSV = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${config.public.apiBase}/products/export`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Gagal mengunduh CSV", err);
  }
};

onMounted(fetchProducts);
</script>

<template>
  <div class="ui container fluid">
    <h1 class="ui header">Daftar Produk</h1>
    <button class="ui basic primary button" @click="openModal()"><i class="plus icon"></i> Produk</button>
    <button class="ui basic green button" @click="exportCSV"><i class="file export icon"></i> Export CSV</button>
    
    <div v-if="loading" class="ui active inline loader"></div>
    <div v-else-if="error" class="ui negative message">{{ error }}</div>
    <table v-else class="ui celled table">
      <thead>
        <tr>
          <th>Nama Produk</th>
          <th>Stok</th>
          <th>Lokasi</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.ID">
          <td>{{ product.name }}</td>
          <td class="right aligned stock-column">
            <div class="ui buttons">
                <button class="ui basic icon button green stock-btn" @click="updateStock(product.ID, 1)"><i class="plus icon"></i></button>
              <div class="ui basic label stock-label">{{ product.quantity }}</div>
              <button class="ui basic icon button red stock-btn" @click="updateStock(product.ID, -1)"><i class="minus icon"></i></button>            </div>
          </td>
          <td>{{ product.location }}</td>
          <td class="center aligned">
            <span class="ui label status-label" :class="{
                red: product.status === 'Out of Stock',
                yellow: product.status === 'Low Stock',
                green: product.status === 'Available',
              }">
                {{ product.status }}
            </span>
          </td>
          <td>
            <button class="ui basic icon button blue" @click="openModal(product)" data-tooltip="Edit produk"><i class="edit icon"></i></button>
            <button class="ui basic icon button red" @click="deleteProduct(product.ID)" data-tooltip="Hapus produk"><i class="trash icon"></i></button>
            <button v-if="product.barcode_path" class="ui basic icon button black" @click="openBarcodeModal(product.sku)" data-tooltip="Lihat barcode"><i class="barcode icon"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal Form -->
  <div v-if="showModal" class="ui modal active">
    <div class="header">{{ isEditing ? "Edit Produk" : "Tambah Produk" }}</div>
    <div class="content">
      <form class="ui form">
        <div class="field">
          <label>Nama Produk</label>
          <input type="text" v-model="productForm.name" />
        </div>
        <div class="field">
          <label>Stok</label>
          <input type="number" v-model="productForm.quantity" />
        </div>
        <div class="field">
          <label>Lokasi</label>
          <input type="text" v-model="productForm.location" />
        </div>
      </form>
    </div>
    <div class="actions">
      <button class="ui button" @click="showModal = false">Batal</button>
      <button class="ui primary button" @click="saveProduct">Simpan</button>
    </div>
  </div>

  <!-- Modal Show Barcode -->
  <div v-if="isBarcodeModalOpen" class="ui modal active">
  <div class="header">Barcode Produk</div>
  <div class="content">
    <img v-if="barcodeUrl" :src="barcodeUrl" alt="Barcode" class="barcode-image">
    <div v-else class="ui active inline loader"></div>
  </div>
  <div class="actions">
    <button class="ui basic button" @click="isBarcodeModalOpen = false">Tutup</button>
    <button class="ui primary button" @click="printBarcode(selectedSKU)">
      <i class="print icon"></i> Cetak
    </button>
  </div>
</div>

</template>

<style scoped>
.ui.container.fluid {
  max-width: 90%;
  margin: auto;
}

.status-label {
  display: inline-block;
  min-width: 100px;
  text-align: center;
}

.ui.celled.table {
  width: 100%;
  table-layout: auto;
}

.ui.very.padded.segment {
  padding: 30px !important;
}

.ui.modal.active {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.stock-label {
  min-width: 50px;
  text-align: center;
}

.stock-btn {
  width: 36px;
  height: 36px;
}

.barcode-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}
</style>
