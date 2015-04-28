R:

	Rscript -e "rmarkdown::render('data/schoolbuses_teaser.Rmd')"

R_deploy:

	cp data/schoolbuses_teaser.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/schoolbuses_teaser_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd

	cd data; \
		cp nocodetemplate.Rmd schoolbuses_teaser_nc.Rmd; \
		cat schoolbuses_teaser.Rmd >> schoolbuses_teaser_nc.Rmd; \
		Rscript -e "rmarkdown::render('schoolbuses_teaser_nc.Rmd')"; \
		cp schoolbuses_teaser_nc.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/; \
		rsync -rv schoolbuses_teaser_nc_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd;

R_all: R R_deploy

	Rscript -e "rmarkdown::render('data/schoolbuses.Rmd')"

	cp data/schoolbuses.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/schoolbuses_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd

	cd data; \
		cp nocodetemplate.Rmd schoolbuses_nc.Rmd; \
		cat schoolbuses.Rmd >> schoolbuses_nc.Rmd; \
		Rscript -e "rmarkdown::render('schoolbuses_nc.Rmd')"; \
		cp schoolbuses_nc.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/; \
		rsync -rv schoolbuses_nc_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd;

R_deploy_main:

	cp data/schoolbuses.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/schoolbuses_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd

	cd data; \
		cp nocodetemplate.Rmd schoolbuses_nc.Rmd; \
		cat schoolbuses.Rmd >> schoolbuses_nc.Rmd; \
		Rscript -e "rmarkdown::render('schoolbuses_nc.Rmd')"; \
		cp schoolbuses_nc.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/; \
		rsync -rv schoolbuses_nc_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd;
