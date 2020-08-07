cd public
git init .
git remote add origin https://github.com/jimboyeah/jimboyeah.github.io.git
git add .
git commit -m "add publish static web"
git push origin master:master -f
rem git checkout -b 