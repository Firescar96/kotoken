class AddBucketIdToAccounts < ActiveRecord::Migration
  def change
    add_column :accounts, :bucket_id, :string
  end
end
