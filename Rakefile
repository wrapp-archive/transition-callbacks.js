require 'rubygems'

desc "build the transition-callbacks files for distribution"
task :default => :clean do
  build_directory = 'build'
  FileUtils.mkdir_p(build_directory)

  compile_js(build_directory)
end

def compile_js(build_directory)
  require 'coffee-script'
  require 'closure-compiler'

  source = File.read(File.join('src', 'coffeescripts', 'transition-callbacks.js.coffee'))

  build_directory = File.join(build_directory, 'javascripts')
  FileUtils.mkdir_p(build_directory)
  output = File.join(build_directory, 'transition-callbacks.js')
  minified_output = File.join(build_directory, 'transition-callbacks-min.js')

  print_action("Compiling CoffeeScript to '#{output}'") do
    File.open(output, 'w+') do |file|
      file.write(source = CoffeeScript.compile(source))
    end
  end

  print_action("Minifying Javascript to '#{minified_output}'") do
    File.open(minified_output, 'w+') do |file|
      file.write(Closure::Compiler.new.compress(source))
    end
  end
end

def print_action(action, &block)
  print "#{action}... "
  STDOUT.flush

  if block.call()
    puts 'done'
  else
    puts 'failed'
  end
end

desc "build the transition-callbacks files for distribution"
task :build => :default

desc "removes the build directory"
task :clean do
  print_action('Removing existing build directory') do
    FileUtils.rm_rf('build')
  end
end

desc "release a new version of transition-callbacks.js"
task :release, [:version] => :clean do |t, args|
  raise 'Please specify a version' unless args.version
  version = args.version

  commands = [
    "sed -E -i '' \"s/@VERSION: '[0-9.]+'/@VERSION: '#{version}'/g\" src/coffeescripts/transition-callbacks.js.coffee",
    "git commit -a -m 'Bump the version to #{version}'",
    "rake clean",
    "git checkout master",
    "git merge develop --no-ff",
    "rake build",
    "git add build -f",
    "git commit -m 'Release version #{version}'",
    "git tag #{version}"
  ].join(' && ')

  system(commands)
end
