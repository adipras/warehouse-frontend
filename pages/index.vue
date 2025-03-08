<template>
    <div class="ui container">
      <!-- Hero Section -->
      <div class="ui segment hero">
        <h1 class="ui header">
          <i class="warehouse icon"></i>
          <div class="content">
            Warehouse Management System
            <div class="sub header">Kelola stok produk dengan efisien</div>
          </div>
        </h1>
      </div>
  
      <!-- Fitur Section -->
      <div class="ui three column stackable grid feature-section">
        <div class="column">
          <NuxtLink to="/products"  class="ui raised segment feature">
            <i class="box icon big"></i>
            <h3>Manajemen Produk</h3>
            <p>Tambahkan, perbarui, dan hapus produk dengan mudah.</p>
          </NuxtLink>
        </div>
        <div class="column">
          <NuxtLink to="/barcodes" class="ui raised segment feature">
            <i class="barcode icon big"></i>
            <h3>Barcode SKU</h3>
            <p>Hasilkan barcode otomatis untuk setiap produk.</p>
          </NuxtLink>
        </div>
        <div class="column">
          <NuxtLink to="/export" class="ui raised segment feature">
            <i class="file excel outline icon big"></i>
            <h3>Ekspor CSV</h3>
            <p>Ekspor data produk dalam format CSV untuk laporan.</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  a {
    text-decoration: none;
    color: inherit;
  }
  .hero {
    text-align: center;
    padding: 4rem 2rem;
    background: #f9fafb;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-top: 2rem; /* Tambahan margin-top */
  }
  
  .hero-text {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 1.5rem;
  }
  
  .feature-section {
    margin-top: 3rem;
  }
  
  .feature {
    text-align: center;
    padding: 2rem;
    height: 200px; /* Fixed height agar sejajar */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    border-radius: 10px;
  }
  
  .feature:hover {
    background: #f0f0f0;
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  </style>
  