R:

	Rscript -e "rmarkdown::render('data/schoolbuses.Rmd')"
	open data/schoolbuses.html

R_deploy:

	cp data/schoolbuses.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/schoolbuses_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/schoolbuses.html