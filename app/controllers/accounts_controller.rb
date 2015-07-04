class AccountsController < ApplicationController
  require 'json'

  before_action :set_account, only: [:show, :edit, :update, :destroy]

  # GET /accounts
  # GET /accounts.json
  def index
    chain_client = Rails.application.config.chain_client
    if params['flag'] == "balance"
      balance = chain_client.get_bucket_asset_balance(params["bucket_id"])
      respond_to do |format|
        format.html { render :text => balance.to_json.to_s}
      end
    end
    if params['flag'] == "bucket_id"
      bucket_id =  Account.where(useid: params[:useid], passcode: params[:passcode]).take.bucket_id
      puts bucket_id
      respond_to do |format|
        format.html { render :text => "{\"bucket_id\":\"#{bucket_id}\"}"}
      end
    end
  end

  # GET /accounts/1
  # GET /accounts/1.json
  def show
  end

  # POST /accounts
  # POST /accounts.json
  def create
    if params["flag"] == "transaction"
      toAccount = Account.where(useid: params[:toid]).take
      if toAccount == nil
        respond_to do |format|
          format.html { render :text => "{\"success\":false, \"message\":\"account not found\"}"}
        end
        return
      end
      chain_client = Rails.application.config.chain_client
      begin
        chain_client.transfer_asset(
          inputs: [
            {
              asset_id: params[:asset],
              bucket_id: params[:bucket_id],
              amount: 1
            }
          ],
          outputs: [
            {
              asset_id: params[:asset],
              bucket_id: toAccount.bucket_id,
              amount: 1
            }
          ]
        )
        rescue ::ChainWallets::ChainAPIError => exception
          puts exception
          respond_to do |format|
            format.html { render :text => "{\"success\":false, \"message\":\"#{exception.to_s}\"}"}
          end
          return
      end
      respond_to do |format|
        format.html { render :text => "{\"success\":true}"}
      end
      return
    end

    @account = Account.new(account_params)
    @account.useid = rand(1...100000)
    @account.passcode = params['passcode1']
    chain_client = Rails.application.config.chain_client
    bucket = chain_client.create_bucket("d9e0997d-43da-4770-9f0e-2b96913bfc13")
    @account.bucket_id = bucket["bucket_id"]

    assetnum = rand(1..4)
    case assetnum
    when 1
      asset = "AcPeTwYT5s2xJmXpDCuMr3JWGvJ9vEMkNF"
    when 2
      asset = "AL9VwZMgDQ2bqLXorU2bJoiMu3MjamZQFm"
    when 3
      asset = "AVBLsxjac7LCYxiXcMnUAricYxVq1YgbkZ"
    when 4
      asset = "AaLWdxW4mCB4Z7i2nW5ocgM6cT7jWEybcD"
    end
    chain_client.issue_asset(
      asset,
      [
        {
          bucket_id: bucket["bucket_id"],
          amount: 10
        }
      ]
    )

    respond_to do |format|
      if @account.save
        #redirect_to action: "show", id:8
        format.html { render :text => "{\"useid\":#{@account.useid},\"passcode\":#{@account.passcode},\"bucket_id\":\"#{@account.bucket_id}\"}"}
        #format.json { render :show, status: :created, location: @account }
      else
        format.html { render :new }
        format.json { render json: @account.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /accounts/1
  # PATCH/PUT /accounts/1.json
  def update
    respond_to do |format|
      if @account.update(account_params)
        format.html { redirect_to @account, notice: 'Account was successfully updated.' }
        format.json { render :show, status: :ok, location: @account }
      else
        format.html { render :edit }
        format.json { render json: @account.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /accounts/1
  # DELETE /accounts/1.json
  def destroy
    @account.destroy
    respond_to do |format|
      format.html { redirect_to accounts_url, notice: 'Account was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_account
      @account =  Account.where(useid: params[:id], passcode: params[:passcode])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def account_params
      params[:account]
    end
end
