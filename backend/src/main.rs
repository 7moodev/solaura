use reqwest::Method;
use serde_json::json;
use warp::Filter;
use solana_client::nonblocking::rpc_client;
use solana_sdk::address_lookup_table::instruction;
use solana_sdk::message::legacy;
use solana_sdk::packet::Meta;
use solana_sdk::{account, signature, transaction}; // For handling JSON responses
use std::error::Error;
use std::fs::File;
use std::fs::read_to_string;
use std::cmp::min as Math;
use std::os::macos::raw;
use std::string;
use solana_client::rpc_request::TokenAccountsFilter;
use solana_sdk::transaction::Transaction;
use solana_sdk::signer::Signer;
use solana_client::{
rpc_client::RpcClient,
rpc_client::GetConfirmedSignaturesForAddress2Config,
rpc_request::RpcRequest,
rpc_config::RpcAccountInfoConfig,
rpc_config::RpcTransactionConfig,
rpc_config::RpcTokenAccountsFilter,
rpc_filter::RpcFilterError,
rpc_filter::RpcFilterType, rpc_filter};
use base58::FromBase58;
use solana_sdk::{signature::Signature,pubkey::{self, Pubkey}, instruction::Instruction};
use std::vec::Vec;
use std::str::FromStr;
use solana_transaction_status_client_types::{EncodedTransaction, UiAccountsList, UiMessage, UiTransaction, UiTransactionEncoding, UiInstruction};
use std::collections::HashMap;
use chrono::{NaiveDateTime, Utc, Duration};
use solana_sdk::vote::state::BlockTimestamp;
use serde::{de, Deserialize, Serialize};
use std::fs;
use std::env;
use tokio::task;  // To offload blocking operations



#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let rpc_client = std::sync::Arc::new(RpcClient::new(env::var("solrpc").unwrap()));
    let pubkey = Pubkey::from_str_const("GoH45jngWyUf2cpB7LNCm11Dnb2UZ7hTR7c1EijRL6Ne");
    
    // run_server().await;
    println!("{}",Signature::default().to_string());
    // println!("{}", is_superteam(rpc_client.clone(), pubkey).await.unwrap());
    // println!("{}", is_degen(&rpc_client, pubkey).unwrap().0);
    // println!("{}", is_degen(&rpc_client, pubkey).unwrap().1);
    // println!("{}", is_affiliated_with_drainer(&rpc_client, pubkey).unwrap().0);
    Ok(())
}
fn fetch_signatures(
    rpc_client: &RpcClient,
    pubkey: Pubkey,
    
) -> Vec<Signature>{
    println!("Fetching signatures");
    let mut transaction_history = rpc_client.get_signatures_for_address(&pubkey).unwrap();
        println!("Fetching more signatures");
        let last_tx = transaction_history.last().unwrap();
        let last_tx_signature = Signature::from_str(&last_tx.signature).unwrap();
        let new_txs = rpc_client.get_signatures_for_address_with_config(&pubkey, GetConfirmedSignaturesForAddress2Config{
            before: Some(last_tx_signature),
            ..GetConfirmedSignaturesForAddress2Config::default()
        }).unwrap();
        transaction_history.extend(new_txs);
    
    let mut signatures: Vec<Signature> = Vec::new();
    
    for i in 0..transaction_history.len() {
        let signature =Signature::from_str(&transaction_history[i].signature).unwrap();
        signatures.push(signature);
    }
    signatures
}

fn fetch_wallet_age(rpc_client: &RpcClient, pubkey: Pubkey) -> Option<i64> {
    println!("Fetching wallet age");
    let mut transaction_history = rpc_client.get_signatures_for_address(&pubkey).unwrap();
    while transaction_history.len() %1000 == 0{
        let last_tx = transaction_history.last().unwrap();
        let last_tx_signature = Signature::from_str(&last_tx.signature).unwrap();
        let new_txs = rpc_client.get_signatures_for_address_with_config(&pubkey, GetConfirmedSignaturesForAddress2Config{
            before: Some(last_tx_signature),
            ..GetConfirmedSignaturesForAddress2Config::default()
        }).unwrap();
        transaction_history.extend(new_txs);
    }
    fetch_transaction_age(rpc_client, Signature::from_str(&transaction_history[transaction_history.len()-1].signature).unwrap())
}
fn fetch_transaction_age(rpc_client: &RpcClient, signature: Signature) -> Option<i64> {
    println!("Fetching transaction");
        let signature = signature;
        let config = RpcTransactionConfig {
            encoding: Some(UiTransactionEncoding::Json),
            commitment: Some(rpc_client.commitment()),
            max_supported_transaction_version: Some(0),
        };
        let confirmed_tx = rpc_client.get_transaction_with_config(&signature, config).unwrap();
        let timestamp = confirmed_tx.block_time.unwrap();
        
    
    // Convert the Unix timestamp to NaiveDateTime (UTC)
    let target_date = NaiveDateTime::from_timestamp_opt(timestamp, 0)
        .ok_or("Invalid timestamp").unwrap();
    let current_date = Utc::now().naive_utc();
    let difference = current_date-target_date;
    let hours_difference = Some(difference.num_hours());
    hours_difference
}

fn fetch_transaction(
    rpc_client: &RpcClient,
    signature: Signature,
) -> EncodedTransaction {
    println!("Fetching transaction");
        let signature = signature;
        let config = RpcTransactionConfig {
            encoding: Some(UiTransactionEncoding::Json),
            commitment: Some(rpc_client.commitment()),
            max_supported_transaction_version: Some(0),
        };
        let confirmed_tx = rpc_client.get_transaction_with_config(&signature, config).unwrap();
        let encoded_transaction_with_status_meta = confirmed_tx.transaction;
        encoded_transaction_with_status_meta.transaction
}

fn fetch_wallet_addresses(transaction: EncodedTransaction) -> Vec<String> {
    println!("Fetching wallet addresses");
    let mut all_addresses: Vec<String> = Vec::new();
        match transaction {
            EncodedTransaction::LegacyBinary(_) => {
                // Handle LegacyBinary case if needed
            }
            EncodedTransaction::Binary(_, _transaction_binary_encoding) => {
                // Handle Binary case if needed
            }
            EncodedTransaction::Json(transaction) => {
                let transaction = transaction.clone();
                match &transaction.message {
                    UiMessage::Raw(raw) => {
                        let raw = raw.clone();
                        for account in &raw.account_keys {
                            all_addresses.push(account.to_string()); // Clone if `account` is a String
                        }
                    }
                    UiMessage::Parsed(parsed) => {
                        let parsed = parsed.clone();
                        for account in &parsed.account_keys {
                            all_addresses.push(account.pubkey.to_string()); // Clone if `account` is a String
                        }
                    }
                }
            }
            EncodedTransaction::Accounts(ui_account_list) => {
                // Assuming `ui_account_list` has a `accounts` field which is a Vec<String>
                for account in &ui_account_list.account_keys {
                    all_addresses.push(account.pubkey.to_string()); // Clone if `account` is a String
                }
            }
        }
    all_addresses
}
fn fetch_instructions(transaction: EncodedTransaction) -> Vec<String> {
    println!("Fetching instructions");
    let mut all_instructions: Vec<String> = Vec::new();
        match transaction {
            EncodedTransaction::LegacyBinary(_) => {
                // Handle LegacyBinary case if needed
            }
            EncodedTransaction::Binary(_, _transaction_binary_encoding) => {
                // Handle Binary case if needed
            }
            EncodedTransaction::Json(transaction) => {
                let transaction = transaction.clone();
                match &transaction.message {
                    UiMessage::Raw(raw) => {
                        print!("here");
                        let raw = raw.clone();
                        for compiled_instruction in &raw.instructions {
                            all_instructions.push(compiled_instruction.data.clone()); // Clone if `account` is a String
                        }
                    }
                    UiMessage::Parsed(parsed) => {
                        print!("not here");
                        let parsed = parsed.clone();
                        for compiled_instruction in &parsed.instructions {
                            match compiled_instruction {
                                UiInstruction::Compiled(_parsed_instruction) => {
                                }
                                UiInstruction::Parsed(_raw_instruction) => {
                              
                                }
                    }
                }
            }
        }
    }
            EncodedTransaction::Accounts(account_list) => {
                print!("WTf");
                // Assuming `ui_account_list` has a `accounts` field which is a Vec<String>
                let account_list = account_list.clone();
                for sig in &account_list.signatures{
                    all_instructions.push(sig.clone());
                }
        }
        }
    all_instructions
}

fn is_new_wallet(rpc_client: &RpcClient, pubkey: Pubkey) -> bool {
    let transaction_history = rpc_client.get_signatures_for_address(&pubkey).unwrap();
    let tx_count = transaction_history.len();
    print!("{}", transaction_history.len());
    if tx_count <50{
        return true;
    }
    else{
        return false;
    }
}

#[derive(Debug, Deserialize, Serialize)]
struct ResponseData {
    status: String,
    message: String,
}

fn is_pump_fun_rugger(client: &RpcClient ,pubkey: Pubkey) -> bool{
    match client.get_token_accounts_by_owner(
        &pubkey,
        TokenAccountsFilter::ProgramId(solana_sdk::config::program::ID) // Solana token program ID
    ) {
        Ok(token_accounts) => {
            if token_accounts.is_empty() {
                return false;
            } else {
                for account in token_accounts {
                    println!("{:?}", account.pubkey);
                    //TODO
                }
                return true;
            }
        }
        Err(err) => {
            eprintln!("Failed to fetch token accounts: {}", err);
            return false;
        }
    }
}fn fetch_drainer(rpc_client: &RpcClient, pubkey: Pubkey) -> Result<Vec<DrainContract>, Box<dyn Error>> {
    let data = fs::read_to_string("../constants.json")?;  // Propagate errors using `?`
    let contracts: Drain = serde_json::from_str(&data)?; // Propagate errors using `?`
    Ok(contracts.contract_addresses)  // Return the result as `Ok`
}
fn is_degen(rpc_client: &RpcClient, pubkey: Pubkey) -> Result<(bool,Signature), Box<dyn Error>> {
    let degeneracy = Pubkey::from_str_const("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"); // Use `?` to propagate errors
    let sigs = fetch_signatures(rpc_client, pubkey);   // Use `?` to propagate errors
    for sig in sigs {
            let transaction = fetch_transaction(rpc_client, sig);
            let accts = fetch_wallet_addresses(transaction);
            if accts.contains(&degeneracy.to_string()) {
                return Ok((true,sig));
            }
        }
        Ok((false, Signature::default()))
    }
 // Return `Ok(false)` if no match is found

fn is_affiliated_with_drainer(rpc_client: &RpcClient, pubkey: Pubkey) -> Result<(bool,Signature), Box<dyn Error>> {
    let drainers = fetch_drainer(rpc_client, pubkey)?;  // Use `?` to propagate errors
    let sigs = fetch_signatures(rpc_client, pubkey);
    for i in 0.. 250.min(sigs.len()) {
        let sig = sigs[i];
        let transaction = fetch_transaction(rpc_client, sig);
        let accts = fetch_wallet_addresses(transaction);
        for drainer in &drainers {
            let drainer_pubkey = Pubkey::from_str_const(&drainer.address);
            if drainer_pubkey.to_string() == pubkey.to_string() {
                return Ok((true, Signature::default()));
            }
            if accts.contains(&drainer_pubkey.to_string()) {
                return Ok((true,sig));
            }
        }
    }
    Ok((false, Signature::default())) // Return `Ok(false)` if no match is found
}
fn is_spammer(rpc_client: &RpcClient, pubkey: Pubkey, limit: u16) -> (bool, Signature) {
    let sigs = fetch_signatures(&rpc_client, pubkey);
    print!("{:?}", sigs);
    // Limit processing to the number of fetched transactions or specified limit.
    for i in 0..limit.min(sigs.len() as u16) {
        let signature= sigs[i as usize];
        let config = RpcTransactionConfig {
            encoding: Some(UiTransactionEncoding::JsonParsed),
            commitment: Some(rpc_client.commitment()),
            max_supported_transaction_version: Some(0),
        };
        let confirmed_tx = rpc_client.get_transaction_with_config(&signature, config).unwrap();
        let encoded_transaction_with_status_meta = confirmed_tx.transaction;
        let meta = encoded_transaction_with_status_meta.meta.unwrap();
        let _pre_balances = meta.pre_balances;
        let tx = fetch_transaction(&rpc_client, sigs[i as usize]);
        let account_addresses = fetch_wallet_addresses(tx.clone());
        let _post_balances = meta.post_balances;
        let instructions = fetch_instructions(tx.clone());
        let mut count_map = HashMap::new();
        for item in &instructions {
            *count_map.entry(item).or_insert(0) += 1;
        }
        if count_map.values().any(|&count| count >= 5) {
            if pubkey.to_string() == account_addresses[0] {
                return (true, signature);
            }
        }
    }
    (false, Signature::default()) // Return false if no spam-like behavior is detected
}

#[derive(Deserialize, Serialize, Debug)]
struct SuperteamContract {
    address: String,
    country: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct Superteam {
    #[serde(rename = "superteam")]
    contract_addresses: Vec<SuperteamContract>,
}
#[derive(Deserialize, Serialize, Debug)]
struct DrainContract{
    address: String,
}
#[derive(Deserialize, Serialize, Debug)]
struct Drain {
    #[serde(rename = "drain")]
    contract_addresses: Vec<DrainContract>,
}
fn load_contract_addresses_from_json(file_path: &str) -> Result<HashMap<Pubkey, String>, Box<dyn Error>> {
    let data = fs::read_to_string(file_path)?;
    // Deserialize the JSON into the Contracts struct
    let contracts: Superteam = serde_json::from_str(&data)?;

    // Initialize the HashMap to store contract addresses and their respective country labels
    let mut nft_addresses: HashMap<Pubkey, String> = HashMap::new();

    // Insert each contract address and country into the HashMap
    for contract in contracts.contract_addresses {
        let pubkey = Pubkey::from_str(&contract.address)?;
        nft_addresses.insert(pubkey, contract.country);
    }
    Ok(nft_addresses)
}
pub async fn is_superteam(rpc_client: std::sync::Arc<RpcClient>, pubkey: Pubkey) -> Result<bool, Box<dyn Error>> {
    // Load and deserialize the JSON file asynchronously
    let data = tokio::fs::read_to_string("constants.json").await?;
    let contracts: Superteam = serde_json::from_str(&data)?;

    // Create a HashMap to store contract addresses and their respective country labels
    let mut nft_addresses: HashMap<Pubkey, String> = HashMap::new();

    // Insert each contract address and country into the HashMap
    for contract in contracts.contract_addresses {
        let pubkey_key = Pubkey::from_str(&contract.address)?;
        nft_addresses.insert(pubkey_key, contract.country);
    }

    // Offload RPC calls to a separate thread to avoid blocking
    let result = task::spawn_blocking(move || {
        for (contract_address, _country) in &nft_addresses {
            let tokens = rpc_client.get_token_accounts_by_owner(&pubkey, TokenAccountsFilter::Mint(*contract_address));
            
            if let Ok(token_accounts) = tokens {
                if !token_accounts.is_empty() {
                    return true;
                }
            }
        }
        false
    }).await?;

    Ok(result)
}

fn analyse(rpc_client: &RpcClient, wallet: String) -> ResponseData {
    let account = Pubkey::from_str_const(&wallet);
    // Pass rpc_client as a reference to pumpfun
    is_pump_fun_rugger(rpc_client, account);  // Ensure pumpfun accepts &RpcClient
    let _transaction_history = rpc_client.get_signatures_for_address(&account).unwrap();
    // println!("{:?}", transaction_history);
    ResponseData {
        status: "success".to_string(),
        message: "Wallet has been analysed".to_string(),
    }
}

async fn run_server() {
    // CORS configuration: allow all origins, methods, and headers
    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(&[warp::http::Method::GET, warp::http::Method::POST])
        .allow_headers(vec!["Content-Type", "Authorization"]);

    // Route to handle requests
    let npm_message_route = warp::get()
        .and(warp::query::<std::collections::HashMap<String, String>>()) // Extract query parameters
        .and_then(|params: std::collections::HashMap<String, String>| async move {
            if let Some(wallet) = params.get("wallet-address") {
                let rpc_client = std::sync::Arc::new(RpcClient::new(env::var("solrpc").unwrap()));
                let superteam = is_superteam(rpc_client.clone(), Pubkey::from_str(wallet).unwrap())
                    .await
                    .unwrap_or_else(|_| false);
                let (is_spammer, spam_sig) = is_spammer(&rpc_client, Pubkey::from_str(wallet).unwrap(), 10);
                // let (is_affiliated_with_drainer, sig) = match is_affiliated_with_drainer(&rpc_client, Pubkey::from_str(wallet).unwrap()) {
                //     Ok(result) => result,
                //     Err(_) => (false, Signature::default()),
                // };
                let degen = is_degen(&rpc_client, Pubkey::from_str(wallet).unwrap()).unwrap().0;
                let overall = "good";
                let mut flags: Vec<String> = Vec::new();
                if superteam {
                    flags.push("superteam-member".to_string());
                }
                if degen {
                    flags.push("degen".to_string());
                }
                if is_spammer {
                    flags.push("spammer".to_string());
                }

                // Send a structured JSON response
                return Ok::<_, warp::Rejection>(warp::reply::json(&json!({
                    "analysis":{
                        "flags": flags,
                    },
                    "walletAddress": wallet,
                    "overall": overall,
                    "age": fetch_wallet_age(&rpc_client, Pubkey::from_str(wallet).unwrap()),
                })));
            }
            // Error response if 'wallet-address' is missing
            Ok::<_, warp::Rejection>(warp::reply::json(&json!({
                "status": "error",
                "message": "No wallet parameter provided"
            })))
        })
        .with(cors); // Apply CORS to the route

    // Start the server on localhost:5000
    warp::serve(npm_message_route)
        .run(([127, 0, 0, 1], 5000)) // Listen on port 5000
        .await;
}