include_recipe "phantomjs"
include_recipe "npm"

gem_package "compass" do
  action :install
end

npm_package "yo"
npm_package "grunt-cli"
npm_package "bower"
npm_package "generator-angular"

# All npm modules do not install on windows otherwise because of super long file names
execute "create_node_modules_directory" do
  command "mkdir /node_modules; chown vagrant:vagrant /node_modules; chmod 777 /node_modules; ln -s /node_modules /vagrant/node_modules"
  action :run
  not_if { ::File.exists?("/node_modules")}
end

# To prevent "Text file busy" error on windows
execute "create_sass_cache_directory" do
  command "mkdir /sass-cache; chown vagrant:vagrant /sass-cache; chmod 777 /sass-cache; ln -s /sass-cache /vagrant/.sass-cache"
  action :run
  not_if { ::File.exists?("/sass-cache")}
end

execute "npm_install" do
  command 'sudo su - vagrant -c "cd /vagrant && npm install"'
  action :run
end

execute "bower_install" do
  command 'sudo su - vagrant -c "cd /vagrant && bower install"'
  action :run
end