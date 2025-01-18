const gulp = require('gulp');
const path = require('path');

gulp.task('build:icons', function() {
  // Copia todos os SVGs do src para o dist
  // Copia SVGs específicos para a raiz do dist
  gulp.src('logo-n8n.svg', { allowEmpty: true })
    .pipe(gulp.dest('dist'));

  // Copia outros SVGs para o diretório nodes/SeatsAero
  return gulp.src('src/**/*.svg', { allowEmpty: true })
    .pipe(gulp.dest('dist/nodes/SeatsAero'));
});

gulp.task('watch:icons', function() {
  gulp.watch('src/**/*.svg', gulp.series('build:icons'));
});

gulp.task('default', gulp.series('build:icons'));
