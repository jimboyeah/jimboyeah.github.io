rem git init .
rem git remote add origin https://github.com/jimboyeah/jimboyeah.github.io.git
rem git remote add gitee https://gitee.com/jimbowhy/jimbowhy.git

hugo --baseURL "https://jimbowhy.gitee.io/"
cd public
git add .
git commit -m "add publish static web"
git push gitee master
cd ..
hugo --baseURL "https://jimboyeah.github.io/"
cd public
git add .
git commit -m "add publish static web"
git push origin master
rem git push origin master:master -f
rem git checkout -b 
cd ..
pause