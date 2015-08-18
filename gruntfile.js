module.exports = function(grunt) {

	grunt.initConfig({
		assemble: {
		  options: {
			assets: 'assets',
			partials: ['app/partials/**/*.hbs'],
			data: 'app/data/*.json',
		/*	layout: 'layouts/main-layout.hbs' */
			flatten: true
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
		  vendor_javascript_files: {
			src: 'app/vendor/*.js',
			dest: 'dist/javascripts/vendor.js',
			flatten: true,
			filter: 'isFile',
		  },
		  image_files: {
		    expand: true,
			src: 'app/images/*.*',
			dest: 'dist/images',
			flatten: true,
			filter: 'isFile',
		  },		
		},
		concat: {
			dist: {
			  src: 'app/javascripts/*.js',
			  dest: 'dist/javascripts/site.js',
			},
		}
	});
	
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', ['assemble', 'copy', 'concat', 'cssmin']);
};