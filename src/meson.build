pkgdatadir = join_paths(get_option('datadir'), meson.project_name())
gnome = import('gnome')

src_res = gnome.compile_resources('xyz.trollcall.Beekeeper.src',
  'xyz.trollcall.Beekeeper.src.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

data_res = gnome.compile_resources('xyz.trollcall.Beekeeper.data',
  'xyz.trollcall.Beekeeper.data.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

bin_conf = configuration_data()
bin_conf.set('GJS', find_program('gjs').full_path())
bin_conf.set('PACKAGE_VERSION', meson.project_version())
bin_conf.set('PACKAGE_NAME', meson.project_name())
bin_conf.set('prefix', get_option('prefix'))
bin_conf.set('libdir', join_paths(get_option('prefix'), get_option('libdir')))
bin_conf.set('datadir', join_paths(get_option('prefix'), get_option('datadir')))
bin_conf.set('resource_path', '/xyz/trollcall/Beekeeper')

configure_file(
  input: 'xyz.trollcall.Beekeeper.in',
  output: 'xyz.trollcall.Beekeeper',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)
