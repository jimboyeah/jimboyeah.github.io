@echo off
cd themes\hugo-theme-iris\exampleSite\
hugo server -D --environment development -p 1234
cd ..\..\..\
@echo on