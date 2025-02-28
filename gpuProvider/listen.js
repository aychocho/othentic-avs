const { ethers } = require("ethers");
const { WebSocketProvider } = require("ethers");

// contract address from Polyscan.
const contractAddress = "0xfF4355F23B17b3D81aBF2e8E5Bd0bb290ec011a9";


// Define the minimal ABI containing the submitTask event.
// Adjust the event parameters as needed.
const abi = [{"inputs":[{"internalType":"address","name":"_extensionImplementation","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[],"name":"ECDSAInvalidSignature","type":"error"},{"inputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"name":"ECDSAInvalidSignatureLength","type":"error"},{"inputs":[{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"ECDSAInvalidSignatureS","type":"error"},{"inputs":[],"name":"EigenRewardsDurationExceedsMaximum","type":"error"},{"inputs":[],"name":"EigenRewardsDurationNotMultipleOfInterval","type":"error"},{"inputs":[{"internalType":"uint256","name":"totalRewards","type":"uint256"}],"name":"EigenRewardsMaxRewardsAmountExceeded","type":"error"},{"inputs":[],"name":"EigenRewardsMustBeRetroactive","type":"error"},{"inputs":[],"name":"EigenRewardsNotSupportedOnL2","type":"error"},{"inputs":[],"name":"EigenRewardsStartTimestampNotMultipleOfInterval","type":"error"},{"inputs":[],"name":"EigenRewardsStartTimestampTooFarInPast","type":"error"},{"inputs":[],"name":"FlowIsCurrentlyPaused","type":"error"},{"inputs":[],"name":"FlowIsCurrentlyUnpaused","type":"error"},{"inputs":[],"name":"InactiveAggregator","type":"error"},{"inputs":[],"name":"InactiveTaskPerformer","type":"error"},{"inputs":[{"internalType":"uint16","name":"taskDefinitionId","type":"uint16"},{"internalType":"uint256","name":"minVotingPower","type":"uint256"}],"name":"InsufficientVotingPowerForTaskDefinition","type":"error"},{"inputs":[],"name":"InvalidAttesterSet","type":"error"},{"inputs":[],"name":"InvalidInitialization","type":"error"},{"inputs":[],"name":"InvalidMaximumNumberOfAttesters","type":"error"},{"inputs":[],"name":"InvalidOperatorsForPayment","type":"error"},{"inputs":[],"name":"InvalidPerformerSignature","type":"error"},{"inputs":[],"name":"InvalidRangeForBatchPaymentRequest","type":"error"},{"inputs":[{"internalType":"uint256","name":"taskDefinitionId","type":"uint256"},{"internalType":"uint256","name":"operatorIndex","type":"uint256"}],"name":"InvalidRestrictedAttester","type":"error"},{"inputs":[],"name":"InvalidTaskDefinition","type":"error"},{"inputs":[],"name":"MessageAlreadySigned","type":"error"},{"inputs":[],"name":"NotInitializing","type":"error"},{"inputs":[{"internalType":"address","name":"_operatorAddress","type":"address"}],"name":"OperatorNotRegistered","type":"error"},{"inputs":[],"name":"PauseFlowIsAlreadyPaused","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[{"internalType":"uint16","name":"taskDefinitionId","type":"uint16"}],"name":"TaskDefinitionNotFound","type":"error"},{"inputs":[],"name":"UnpausingFlowIsAlreadyUnpaused","type":"error"},{"inputs":[],"name":"ZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"uint256","name":"requestedTaskNumber","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"requestedAmountClaimed","type":"uint256"}],"name":"ClearPaymentRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"startTimestamp","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"duration","type":"uint32"},{"components":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"feeToClaim","type":"uint256"}],"indexed":false,"internalType":"struct IAttestationCenter.PaymentRequestMessage[]","name":"operators","type":"tuple[]"},{"indexed":false,"internalType":"uint256","name":"lastPaidTaskNumber","type":"uint256"}],"name":"EigenPaymentsRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes4","name":"_pausableFlow","type":"bytes4"},{"indexed":false,"internalType":"address","name":"_pauser","type":"address"}],"name":"FlowPaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes4","name":"_pausableFlowFlag","type":"bytes4"},{"indexed":false,"internalType":"address","name":"_unpauser","type":"address"}],"name":"FlowUnpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"version","type":"uint64"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"uint256[4]","name":"blsKey","type":"uint256[4]"}],"name":"OperatorBlsKeyUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"uint256","name":"votingPower","type":"uint256"}],"name":"OperatorRegisteredToNetwork","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"operatorId","type":"uint256"}],"name":"OperatorUnregisteredFromNetwork","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"feeToClaim","type":"uint256"}],"indexed":false,"internalType":"struct IAttestationCenter.PaymentRequestMessage[]","name":"operators","type":"tuple[]"},{"indexed":false,"internalType":"uint256","name":"lastPaidTaskNumber","type":"uint256"}],"name":"PaymentsRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_operatorId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_baseRewardFeeForOperator","type":"uint256"},{"indexed":true,"internalType":"uint32","name":"_taskNumber","type":"uint32"}],"name":"RewardAccumulated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newMessageHandler","type":"address"}],"name":"SetMessageHandler","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"uint32","name":"taskNumber","type":"uint32"},{"indexed":false,"internalType":"string","name":"proofOfTask","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":true,"internalType":"uint16","name":"taskDefinitionId","type":"uint16"},{"indexed":false,"internalType":"uint256[]","name":"attestersIds","type":"uint256[]"}],"name":"TaskRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"uint32","name":"taskNumber","type":"uint32"},{"indexed":false,"internalType":"string","name":"proofOfTask","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":true,"internalType":"uint16","name":"taskDefinitionId","type":"uint16"},{"indexed":false,"internalType":"uint256[]","name":"attestersIds","type":"uint256[]"}],"name":"TaskSubmitted","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EXTENSION_IMPLEMENTATION","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"avsLogic","outputs":[{"internalType":"contract IAvsLogic","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"avsTreasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"beforePaymentsLogic","outputs":[{"internalType":"contract IBeforePaymentsLogic","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"feeToClaim","type":"uint256"}],"internalType":"struct IAttestationCenter.PaymentRequestMessage[]","name":"_operators","type":"tuple[]"},{"internalType":"uint256","name":"_paidTaskNumber","type":"uint256"}],"name":"clearBatchPayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_operatorId","type":"uint256"}],"name":"getOperatorPaymentDetail","outputs":[{"components":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"lastPaidTaskNumber","type":"uint256"},{"internalType":"uint256","name":"feeToClaim","type":"uint256"},{"internalType":"enum IAttestationCenter.PaymentStatus","name":"paymentStatus","type":"uint8"}],"internalType":"struct IAttestationCenter.PaymentDetails","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"_taskDefinitionId","type":"uint16"}],"name":"getTaskDefinitionMaximumNumberOfAttesters","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"_taskDefinitionId","type":"uint16"}],"name":"getTaskDefinitionMinimumVotingPower","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"_taskDefinitionId","type":"uint16"}],"name":"getTaskDefinitionRestrictedAttesters","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"avsGovernanceMultisigOwner","type":"address"},{"internalType":"address","name":"operationsMultisig","type":"address"},{"internalType":"address","name":"communityMultisig","type":"address"},{"internalType":"address","name":"messageHandler","type":"address"},{"internalType":"address","name":"obls","type":"address"},{"internalType":"address","name":"avsTreasury","type":"address"},{"internalType":"bool","name":"isRewardsOnL2","type":"bool"},{"internalType":"address","name":"internalTaskHandler","type":"address"}],"internalType":"struct IAttestationCenter.InitializationParams","name":"_initializationParams","type":"tuple"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"internalTaskHandler","outputs":[{"internalType":"contract IInternalTaskHandler","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_pausableFlow","type":"bytes4"}],"name":"isFlowPaused","outputs":[{"internalType":"bool","name":"_isPaused","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextEigenRewardsBatchStartTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numOfActiveOperators","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numOfTaskDefinitions","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numOfTotalOperators","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"obls","outputs":[{"internalType":"contract IOBLS","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"}],"name":"operatorsIdsByAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_pausableFlow","type":"bytes4"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"uint256","name":"_votingPower","type":"uint256"},{"internalType":"uint256[4]","name":"_blsKey","type":"uint256[4]"},{"internalType":"address","name":"_rewardsReceiver","type":"address"}],"name":"registerToNetwork","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"requestBatchPayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"requestBatchPayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_startTimestamp","type":"uint32"},{"internalType":"uint32","name":"_duration","type":"uint32"},{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"requestEigenBatchPayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_oblsSharesSyncer","type":"address"}],"name":"setOblsSharesSyncer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"proofOfTask","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"taskPerformer","type":"address"},{"internalType":"uint16","name":"taskDefinitionId","type":"uint16"}],"internalType":"struct IAttestationCenter.TaskInfo","name":"_taskInfo","type":"tuple"},{"components":[{"internalType":"bool","name":"isApproved","type":"bool"},{"internalType":"uint256[2]","name":"tpSignature","type":"uint256[2]"},{"internalType":"uint256[2]","name":"taSignature","type":"uint256[2]"},{"internalType":"uint256[]","name":"attestersIds","type":"uint256[]"}],"internalType":"struct IAttestationCenter.BlsTaskSubmissionDetails","name":"_blsTaskSubmissionDetails","type":"tuple"}],"name":"submitTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"proofOfTask","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"taskPerformer","type":"address"},{"internalType":"uint16","name":"taskDefinitionId","type":"uint16"}],"internalType":"struct IAttestationCenter.TaskInfo","name":"_taskInfo","type":"tuple"},{"components":[{"internalType":"bool","name":"isApproved","type":"bool"},{"internalType":"bytes","name":"tpSignature","type":"bytes"},{"internalType":"uint256[2]","name":"taSignature","type":"uint256[2]"},{"internalType":"uint256[]","name":"attestersIds","type":"uint256[]"}],"internalType":"struct IAttestationCenter.EcdsaTaskSubmissionDetails","name":"_ecdsaTaskSubmissionDetails","type":"tuple"}],"name":"submitTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"taskNumber","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newMessageHandler","type":"address"}],"name":"transferMessageHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"}],"name":"unRegisterOperatorFromNetwork","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_pausableFlow","type":"bytes4"}],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[4]","name":"_blsKey","type":"uint256[4]"},{"components":[{"internalType":"uint256[2]","name":"signature","type":"uint256[2]"}],"internalType":"struct BLSAuthLibrary.Signature","name":"_authSignature","type":"tuple"}],"name":"updateBlsKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"uint16","name":"_taskDefinitionId","type":"uint16"}],"name":"verifyOperatorValidForTaskDefinition","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"}],"name":"votingPower","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];


// connect to amoy websocket rpc
const provider = new WebSocketProvider("wss://polygon-amoy-bor-rpc.publicnode.com");

// Create a contract instance.
const contract = new ethers.Contract(contractAddress, abi, provider);

contract.on("TaskSubmitted", (operator, taskNumber, proofOfTask, data, taskDefinitionId) => {
    console.log("submitTask event received:");
    console.log("proofOfTask:", proofOfTask);
    console.log("data:", data);
    console.log("taskDefId:", taskDefinitionId);
    console.log("performerAddress:", operator);
    console.log("signature:", signature);
    console.log("Task Number:", taskNumber);
  });

  contract.on("TaskRejected", (operator, taskNumber, proofOfTask, data, taskDefinitionId) => {
    console.log("submitTask event received:");
    console.log("proofOfTask:", proofOfTask);
    console.log("data:", data);
    console.log("taskDefId:", taskDefinitionId);
    console.log("performerAddress:", operator);
    console.log("signature:", signature);
    console.log("Task Number:", taskNumber);
  });
  
