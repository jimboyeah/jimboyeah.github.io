@echo off
cd themes\syna\exampleSite\
hugo server -D --environment development -p 1234
cd ..\..\..\
@echo on