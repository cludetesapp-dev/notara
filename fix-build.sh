#!/bin/bash

# ProductRepository
sed -i '' "s/\.where('isArchived')\.equals(0 as unknown as boolean)[[:space:]]*\.and(p => !p.deletedAt)/.filter(p => !p.isArchived \&\& !p.deletedAt)/g" src/repositories/ProductRepository.ts

# PartnerRepository
sed -i '' "s/\.where('isArchived')\.equals(0 as unknown as boolean)[[:space:]]*\.and(p => !p.deletedAt)/.filter(p => !p.isArchived \&\& !p.deletedAt)/g" src/repositories/PartnerRepository.ts

# useTransactionForm
perl -0pi -e "s/db\.products\.where\('isArchived'\)\.equals\(0 as unknown as boolean\)\.toArray\(\)/db.products.filter(p => !p.isArchived).toArray()/g" src/features/transactions/useTransactionForm.ts

perl -0pi -e "s/db\.partners\.where\('isArchived'\)\.equals\(0 as unknown as boolean\)\.toArray\(\)/db.partners.filter\(p => !p.isArchived\)\.toArray\(\)/g" src/features/transactions/useTransactionForm.ts

# syncService
perl -0pi -e "s/const camel = snakeToCamel\\(row\\)/const camel = snakeToCamel(row) as { id: string; updatedAt: string; [key:string]: unknown }/g" src/services/syncService.ts

# unused imports
perl -0pi -e "s/, formatRupiah//g" src/features/reports/YearlyReport.tsx
perl -0pi -e "s/Transaction, //g" src/features/reports/useReportData.ts

echo
echo "PATCH SELESAI"
