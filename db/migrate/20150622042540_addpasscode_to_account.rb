class AddpasscodeToAccount < ActiveRecord::Migration
  def change
    add_column :accounts, :passcode, :string
    change_column :accounts, :uid, :integer, limit: 5
  end
end
