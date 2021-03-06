class AccountsController < ApplicationController
  require 'json'

  before_action :set_account, only: [:show, :edit, :update, :destroy]

  def getTransactions (bucket_id)
    brickAsset = "AaLWdxW4mCB4Z7i2nW5ocgM6cT7jWEybcD"
    steakAsset = "AVBLsxjac7LCYxiXcMnUAricYxVq1YgbkZ"
    bitcoinAsset = "AL9VwZMgDQ2bqLXorU2bJoiMu3MjamZQFm"
    phoneAsset = "AcPeTwYT5s2xJmXpDCuMr3JWGvJ9vEMkNF"

    chain_client = Rails.application.config.chain_client
    activity = chain_client.get_bucket_asset_activity(bucket_id)
    transactions = []
    activity[:items].each_entry do |action|
      transaction = {}
      if action["inputs"] == nil
        transaction["from"] = "Genesis Transaction"
      else
        fromBucket = action["inputs"][0]["bucket_id"]
        fromAccount = Account.where(bucket_id: fromBucket).take
        if fromAccount == nil
          next
        end
        transaction["from"] = fromAccount.uid
      end

      toBucket = action["outputs"][0]["bucket_id"]
      toAccount = Account.where(bucket_id: toBucket).take
      if toAccount == nil
        next
      end
      transaction["to"] = toAccount.uid

      case action["outputs"][0]["asset_id"]
      when brickAsset
        transaction["asset"] = "brick"
      when steakAsset
        transaction["asset"] = "steak"
      when bitcoinAsset
        transaction["asset"] = "bitcoin"
      when phoneAsset
        transaction["asset"] = "phone"
      end

      transactions << transaction

      if transactions.length >= 10
        break
      end
    end
    return transactions
  end


  # GET /accounts
  # GET /accounts.json
  def index
    chain_client = Rails.application.config.chain_client
    response = {}
    if params['flag'] == "balance"
      balance = chain_client.get_bucket_asset_balance(params["bucket_id"])
      puts "balance"
      puts balance
      respond_to do |format|
        format.html { render :text => balance.to_json.to_s}
      end
    end
    if params['flag'] == "bucket_id"
      @account  = Account.where(uid: params[:uid], passcode: params[:passcode]).take
      if @account == nil
        response["success"] = false
        response["message"] = "account could not be found"
        respond_to do |format|
          format.html { render :text => JSON.generate(response)}
        end
        return
      end
      response["success"] = true
      response["bucket_id"] = @account.bucket_id
      respond_to do |format|
        format.html { render :text =>  JSON.generate(response)}
      end
    end
    if params['flag'] == "transactions"
      respond_to do |format|
        format.html { render :text => getTransactions(params[:bucket_id]).to_json.to_s}
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
    response = {}
    if params["flag"] == "transaction"
      toAccount = Account.where(uid: params[:toid]).take
      if toAccount == nil
        response["success"] = false
        response["message"] = "account not found"
        respond_to do |format|
          format.html { render :text =>  JSON.generate(response)}
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
              amount: 1,
              min_confirmations: 0
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
          response["success"] = false
          response["message"] = exception.to_s
          respond_to do |format|
            format.html { render :text =>  JSON.generate(response)}
          end
          return
      end
      response["success"] = true
      respond_to do |format|
        format.html { render :text =>  JSON.generate(response)}
      end
      return
    end

    @account  = Account.where(uid: params[:uid]).take
      if @account != nil
        respond_to do |format|
          response["success"] = false
          response["message"] = "account alredy exists"
          format.html { render :text =>  JSON.generate(response)}
        end
        return
      end

    @account = Account.new(account_params)
    @account.uid = params[:uid]
    @account.passcode = params[:passcode]
    chain_client = Rails.application.config.chain_client
    bucket = chain_client.create_bucket("d9e0997d-43da-4770-9f0e-2b96913bfc13")
    @account.bucket_id = bucket["bucket_id"]
    asset = params[:asset]

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
      response["success"] = true
      response["bucket_id"] = @account.bucket_id
      if @account.save
        #redirect_to action: "show", id:8
        format.html { render :text =>  JSON.generate(response)}
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_account
      @account =  Account.where(uid: params[:id], passcode: params[:passcode])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def account_params
      params[:account]
    end
end
