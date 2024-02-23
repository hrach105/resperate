const { src, dest, parallel, series, watch } = require("gulp")

const browserSync = require("browser-sync").create()

const concat = require("gulp-concat")

const sass = require("gulp-sass")(require("sass"))

const autoprefixer = require("gulp-autoprefixer")

const cleancss = require("gulp-clean-css")

const clean = require("gulp-clean")

function browsersync() {
	browserSync.init({
		server: { baseDir: "app/" },
		notify: false,
		online: true,
	})
}

function scripts() {
	return src(["node_modules/jquery/dist/jquery.min.js", "app/js/app.js"])
		.pipe(concat("app.min.js"))
		.pipe(dest("app/js/"))
		.pipe(browserSync.stream())
}

function styles() {
	return src("app/scss/**/*.scss")
		.pipe(sass())
		.pipe(concat("app.min.css"))
		.pipe(autoprefixer({ overrideBrowserslist: ["last 3 versions"] }))
		.pipe(dest("app/css/"))
		.pipe(browserSync.stream())
}

async function images() {
	return src(["app/images/**/*"], { base: "app" }).pipe(dest("dist"))
}

function buildcopy() {
	return src(
		[
			"app/css/**/*.min.css",
			"app/js/**/*.min.js",
			"app/images/**/*",
			"app/**/*.html",
		],
		{ base: "app" }
	).pipe(dest("dist"))
}

function cleandist() {
	return src("dist", { allowEmpty: true }).pipe(clean())
}

function startwatch() {
	watch(["app/**/*.js", "!app/**/*.min.js"], scripts)

	watch("app/**/scss/**/*", styles)

	watch("app/**/*.html").on("change", browserSync.reload)

	watch("app/images/src/**/*", images)
}

exports.browsersync = browsersync

exports.scripts = scripts

exports.styles = styles

exports.images = images

exports.build = series(cleandist, styles, scripts, buildcopy)

exports.default = parallel(styles, scripts, browsersync, startwatch)
