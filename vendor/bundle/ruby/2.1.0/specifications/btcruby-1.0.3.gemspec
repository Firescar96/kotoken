# -*- encoding: utf-8 -*-
# stub: btcruby 1.0.3 ruby lib

Gem::Specification.new do |s|
  s.name = "btcruby"
  s.version = "1.0.3"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Oleg Andreev", "Ryan Smith"]
  s.date = "2015-06-09"
  s.description = "Ruby library for interacting with Bitcoin."
  s.email = "oleganza+btcruby@gmail.com"
  s.homepage = "https://github.com/oleganza/btcruby"
  s.licenses = ["MIT"]
  s.rubyforge_project = "btcruby"
  s.rubygems_version = "2.2.2"
  s.summary = "Ruby library for interacting with Bitcoin."

  s.installed_by_version = "2.2.2" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<ffi>, [">= 1.9.3", "~> 1.9"])
    else
      s.add_dependency(%q<ffi>, [">= 1.9.3", "~> 1.9"])
    end
  else
    s.add_dependency(%q<ffi>, [">= 1.9.3", "~> 1.9"])
  end
end
