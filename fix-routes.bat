@echo off
REM Delete conflicting route directories
cd /d "c:\Users\studies.bishal\news\app"

REM Delete [slug] directory
if exist "[slug]" (
    echo Deleting [slug] directory...
    for /d %%D in ("[slug]") do rd /s /q "%%D"
    echo Deleted [slug]
)

REM Delete category directory  
if exist "category" (
    echo Deleting category directory...
    rd /s /q "category"
    echo Deleted category
)

echo Done! Conflicting routes removed.
pause
