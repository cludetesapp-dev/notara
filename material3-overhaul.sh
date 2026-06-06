#!/bin/bash

# Backup
cp src/index.css src/index.css.bak

cat >> src/index.css <<'CSS'

/* ==========================================
   MATERIAL 3 OVERRIDE - NOTARA
   ========================================== */

:root{
  --primary:#0B57D0;
  --primary-container:#D3E3FD;
  --surface:#F8FAFD;
  --surface-container:#EDF2FA;
  --surface-high:#E8F0FE;
  --outline:#D2D8E3;
  --text-primary:#1F1F1F;
  --text-secondary:#5F6368;

  --r:16px;
  --r-lg:28px;
}

body{
  background:var(--surface)!important;
  color:var(--text-primary)!important;
}

/* Top Bar */

.app-bar{
  background:var(--surface)!important;
  border-bottom:1px solid var(--outline)!important;
  box-shadow:none!important;
}

.bar-brand-name{
  color:var(--text-primary)!important;
}

.bar-brand-sub{
  color:var(--text-secondary)!important;
}

.bar-brand-box{
  background:var(--primary)!important;
  border-radius:14px!important;
}

.bar-btn{
  background:var(--surface-container)!important;
  color:var(--text-primary)!important;
  border:none!important;
  border-radius:14px!important;
}

/* Bottom Nav */

.bottom-nav{
  background:var(--surface)!important;
  border-top:1px solid var(--outline)!important;
  box-shadow:none!important;
}

.nav-item{
  color:var(--text-secondary)!important;
}

.nav-item.active{
  color:var(--primary)!important;
}

.nav-item.active svg{
  background:var(--primary-container)!important;
  border-radius:999px!important;
  padding:6px!important;
}

.nav-add{
  background:var(--primary)!important;
  border-radius:16px!important;
  width:56px!important;
  height:56px!important;
  box-shadow:0 4px 12px rgba(11,87,208,.25)!important;
}

/* Cards */

.dashboard-card,
.stat-card{
  background:white!important;
  border:1px solid var(--outline)!important;
  border-radius:24px!important;
  box-shadow:0 1px 2px rgba(0,0,0,.04)!important;
}

/* Inputs */

.field input,
.field select,
.field textarea{
  background:white!important;
  border:1px solid var(--outline)!important;
  border-radius:16px!important;
}

.field input:focus,
.field select:focus,
.field textarea:focus{
  border-color:var(--primary)!important;
  box-shadow:0 0 0 4px rgba(11,87,208,.12)!important;
}

/* Buttons */

.btn-primary{
  background:var(--primary)!important;
  border:none!important;
  border-radius:20px!important;
}

/* Toast */

#toast{
  background:#202124!important;
  border-radius:20px!important;
}

CSS

echo
echo "Material 3 CSS applied"
