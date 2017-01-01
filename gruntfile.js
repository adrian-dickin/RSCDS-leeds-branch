module.exports = function(grunt) {

	grunt.initConfig({
		assemble: {
		  options: {
			assets: 'assets',
			partials: ['app/partials/**/*.hbs'],
			data: 'app/data/*.json',
			flatten: true,
			helpers: ['handlebars-helper-filehash', 'handlebars-helper-minify', 'app/helpers/**.js'],
		  },
		  site: {
		  	options: {layout: 'app/layouts/main-layout.hbs' },
			src: ['app/templates/*.hbs'],
			dest: 'dist/'
		  }
		},
		
		cssmin: {
			target: {
				files: [{
				  src: ['app/stylesheets/*.css'],
				  dest: 'dist/stylesheets/site.css',
				}]
			  }
		},
		
		copy: {
		  vendor_files: {
		    expand: true,
		    cwd: 'app/',
			src: 'vendor/**/*',
			dest: 'dist/',
			filter: 'isFile'
		  },
		  image_files: {
		    expand: true,
			src: 'app/images/*.*',
			dest: 'dist/images',
			flatten: true,
			filter: 'isFile'
		  },		
		},
		concat: {
			dist: {
			  src: 'app/javascripts/*.js',
			  dest: 'dist/javascripts/site.js',
			},
		},

		clean: {
			all: ['dist/*']
		},
		
		sitemap: {
			dist: {
				pattern: ['dist/*.html'], 
				siteRoot: 'dist/',
				homepage: 'http://www.rscdsleeds.org.uk/'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-assemble');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-sitemap');
	grunt.registerTask('default', ['clean', 'cssmin', 'copy', 'concat', 'assemble', 'sitemap']);
};