class AddUidToProduct < ActiveRecord::Migration
  def change
    add_column :accounts, :uid, :integer
  end
end
