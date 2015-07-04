# -*- encoding: utf-8 -*-
# stub: beefcake 1.0.0 ruby lib

Gem::Specification.new do |s|
  s.name = "beefcake"
  s.version = "1.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Blake Mizerany", "Matt Proud", "Bryce Kerley"]
  s.date = "2014-09-05"
  s.description = "A sane protobuf library for Ruby"
  s.email = ["blake.mizerany@gmail.com", "matt.proud@gmail.com", "bkerley@brycekerley.net"]
  s.executables = ["protoc-gen-beefcake"]
  s.files = ["bin/protoc-gen-beefcake"]
  s.homepage = "https://github.com/protobuf-ruby/beefcake"
  s.licenses = ["MIT"]
  s.required_ruby_version = Gem::Requirement.new(">= 1.9.3")
  s.rubygems_version = "2.2.2"
  s.summary = "A sane protobuf library for Ruby"

  s.installed_by_version = "2.2.2" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rake>, ["~> 10.1.0"])
      s.add_development_dependency(%q<minitest>, ["~> 5.3"])
    else
      s.add_dependency(%q<rake>, ["~> 10.1.0"])
      s.add_dependency(%q<minitest>, ["~> 5.3"])
    end
  else
    s.add_dependency(%q<rake>, ["~> 10.1.0"])
    s.add_dependency(%q<minitest>, ["~> 5.3"])
  end
end
