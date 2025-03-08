<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const loading = ref(true);
const error = ref(null);

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

onMounted(fetchProducts);
</script>

<template>
  <div class="ui container fluid">
    <h1 class="ui header">Daftar Produk</h1>
    <button class="ui primary button">Tambah Produk</button>
    
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
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td class="right aligned">{{ product.quantity }}</td>
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
            <button class="ui icon button blue"><i class="edit icon"></i></button>
            <button class="ui icon button red"><i class="trash icon"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
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
</style>
