@echo off
REM Delete conflicting page files

echo Deleting app/article/[id]/page.tsx...
del "c:\Users\studies.bishal\news\app\article\[id]\page.tsx"

echo Deleting old auth pages...
del "c:\Users\studies.bishal\news\app\auth\google-login\page.tsx" 2>nul
del "c:\Users\studies.bishal\news\app\auth\login\page.tsx" 2>nul

echo Deleting temporary files...
del "c:\Users\studies.bishal\news\app\DELETE_ME_CONFLICTING_ROUTES.txt" 2>nul

echo Done!
