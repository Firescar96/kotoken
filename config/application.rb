require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Mldemo
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    config.chain_client = ChainWallets::Client.new(
      token_id: '9ca4b2d8be570ef5a87161b5c3ee324c',
      token_secret: '3acfa54820575444ffbc54c3edbd4d8e'

      # To generate signed Payment Requests, provide
      # an X509 certificate
=begin
      c_key_path: "(path to RSA private key)"
      c_path: "(path to x.509 cert in RSA format)"
      c_root_ca_path: "(optional: path to root cert in RSA format)"
=end
    )

    config.chain_client.keystore.add(ChainWallets::XPrvKey.new(
    "xprv9s21ZrQH143K4DfGsGotRE8ffTjP9mMnQA526yzZAHvmkE7Kai5n1jHbLzj5VejGrB51RN2ify7uvxZAVZ33QFDxwJYN3xrnsEB8Z43mEpW",
    true
    ))
  end
end
