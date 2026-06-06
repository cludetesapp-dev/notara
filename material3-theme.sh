#!/bin/bash

cp src/index.css src/index.css.backup

cat >> src/index.css <<'CSS'

/* ================================
   MATERIAL YOU GOOGLE BLUE
   ================================ */

:root{
  --green:#0B57D0 !important;
  --green-mid:#1A73E8 !important;
  --green-light:#D3E3FD !important;
  --green-pale:#EEF3FD !important;
  --green-muted:#C7D7F7 !important;

  --amber:#5F6368 !important;
  --amber-pale:#F1F3F4 !important;
  --amber-border:#DADCE0 !important;

  --soil:#1F1F1F !important;
  --clay:#3C4043 !important;
  --stone:#5F6368 !important;

  --surface:#F8FAFD !important;
  --surface-container:#EEF3FD !important;
  --outline:#DADCE0 !important;
}

/* active nav tidak mengecil */
.nav-item.active svg{
  padding:0 !important;
  transform:none !important;
}

.nav-item.active{
  color:#0B57D0 !important;
}

.nav-item.active .nav-item-label{
  color:#0B57D0 !important;
  font-weight:700 !important;
}

/* pill background */
.nav-item.active{
  background:#D3E3FD !important;
  border-radius:999px !important;
}

/* logo */
.bar-brand-box{
  background:#0B57D0 !important;
  border-radius:14px !important;
}

/* cards */
.dashboard-card,
.stat-card{
  background:#FFFFFF !important;
  border:1px solid #DADCE0 !important;
  box-shadow:0 1px 2px rgba(0,0,0,.06) !important;
}

/* charts */
.recharts-cartesian-grid line{
  stroke:#E8EAED !important;
}

/* fab */
.nav-add{
  background:#0B57D0 !important;
  border-radius:16px !important;
}

/* sheets */
.sheet,
.modal,
.dialog{
  border-radius:28px 28px 0 0 !important;
}

/* search */
input[type="search"]{
  background:#EEF3FD !important;
}

/* smooth */
*{
  transition:
    background-color .15s ease,
    border-color .15s ease,
    color .15s ease;
}

CSS

echo "Material 3 theme installed"
