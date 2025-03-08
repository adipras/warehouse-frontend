<script setup>
definePageMeta({
  layout: "default",
  title: "Dashboard",
  description: "Halaman dashboard aplikasi Warehouse",
});

import { ref, onMounted } from "vue";
import axios from "axios";

const summary = ref({
  totalProducts: 0,
  outOfStock: 0,
  lowStock: 0,
});

const latestProducts = ref([]);

const config = useRuntimeConfig()

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${config.public.apiBase}/products/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    summary.value = data.summary || { totalProducts: 0, outOfStock: 0, lowStock: 0 };
    latestProducts.value = data.latestProducts || [];
  } catch (error) {
    console.error("Gagal memuat data dashboard", error);
  }
};

onMounted(fetchDashboardData);
</script>

<template>
  <div class="ui container fluid">
    <div class="ui very padded raised segment">
      <h1 class="ui header">📊 Dashboard</h1>

      <div class="ui three statistics">
        <div class="ui statistic green">
          <div class="value">{{ summary.totalProducts }}</div>
          <div class="label">Total Produk</div>
        </div>
        <div class="ui statistic red">
          <div class="value">{{ summary.outOfStock }}</div>
          <div class="label">Stok Habis</div>
        </div>
        <div class="ui statistic yellow">
          <div class="value">{{ summary.lowStock }}</div>
          <div class="label">Stok Rendah</div>
        </div>
      </div>
    </div>

    <div class="ui very padded segment">
      <h2 class="ui dividing header">🛒 Produk Terbaru</h2>
      <table class="ui celled table">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th style="text-align: right;">Stok</th>
            <th>Lokasi</th>
            <th style="text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in latestProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td style="text-align: right;">{{ product.quantity }}</td>
            <td>{{ product.location }}</td>
            <td style="text-align: center;">
              <span class="ui label status-label" :class="{
                red: product.status === 'Out of Stock',
                yellow: product.status === 'Low Stock',
                green: product.status === 'Available',
              }">
                {{ product.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
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
</style>
