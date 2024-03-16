// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Error
error AlreadyVoted(string name);
error NotVerified(string name);
error VotingNotStart();
error VotingClosed();
error NotOwner();

contract Voting {
    // Variable
    address private immutable i_admin;
    uint256 public s_candidateCount;
    uint256 public s_voterCount;
    bool start;
    bool end;

    // modifier
    modifier onlyAdmin() {
        // Modifier for only admin access
        if (msg.sender == i_admin) {
            revert NotOwner();
        }
        _;
    }

    // Constructor
    constructor() {
        // Initilizing default values
        i_admin = msg.sender;
        s_candidateCount = 0;
        s_voterCount = 0;
        start = false;
        end = false;
    }

    // Modeling a candidate
    struct Candidate {
        uint256 candidateId;
        string name;
        string slogan;
        string partyName;
        string aadhar;
        uint256 voteCount;
    }

    //mapping
    mapping(uint256 => Candidate) public candidateDetails;

    // Adding new candidates
    function addCandidate(
        string memory _name,
        string memory _slogan,
        string memory _partyName,
        string memory _aadhar
    )
        public
        // Only admin can add
        onlyAdmin
    {
        Candidate memory newCandidate = Candidate({
            candidateId: s_candidateCount,
            name: _name,
            slogan: _slogan,
            partyName: _partyName,
            aadhar: _aadhar,
            voteCount: 0
        });
        candidateDetails[s_candidateCount] = newCandidate;
        s_candidateCount += 1;
    }

    // Get candidates count
    function getTotalCandidate() public view returns (uint256) {
        // Returns total number of candidates
        return s_candidateCount;
    }

    // Get voters count
    function getTotalVoter() public view returns (uint256) {
        // Returns total number of voters
        return s_voterCount;
    }

    // Modeling a voter
    struct Voter {
        address voterAddress;
        string name;
        string phone;
        string aadhar;
        string email;
        bool isVerified;
        bool hasVoted;
        bool isRegistered;
    }
    address[] public voters; // Array of address to store address of voters
    mapping(address => Voter) public voterDetails; // isko private krna hai

    // Request to be added as voter
    function registerAsVoter(
        string memory _name,
        string memory _phone,
        string memory _aadhar,
        string memory _email
    ) public {
        Voter memory newVoter = Voter({
            voterAddress: msg.sender,
            name: _name,
            phone: _phone,
            aadhar: _aadhar,
            email: _email,
            isVerified: false,
            hasVoted: false,
            isRegistered: true
        });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        s_voterCount += 1;
    }

    // Verify voter
    function verifyVoter(
        bool _verifedStatus,
        address voterAddress
    )
        public
        // Only admin can verify
        onlyAdmin
    {
        voterDetails[voterAddress].isVerified = _verifedStatus;
    }

    // vote
    function vote(uint256 candidateId) public {
        if (voterDetails[msg.sender].hasVoted == true) {
            revert AlreadyVoted(voterDetails[msg.sender].name);
        }
        if (voterDetails[msg.sender].isVerified == false) {
            revert NotVerified(voterDetails[msg.sender].name);
        }
        if (start = false) {
            revert VotingNotStart();
        }
        if (end = true) {
            revert VotingClosed();
        }
        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    // End election
    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    // Get election start and end values
    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }

    // Modeling a Election Details
    struct ElectionDetails {
        string adminName;
        string adminEmail;
        string adminTitle;
        string electionTitle;
        string organizationTitle;
    }
    ElectionDetails public electionDetails; // public only for test cases

    // Set Elections details
    function setElectionDetails(
        string memory _adminName,
        string memory _adminEmail,
        string memory _adminTitle,
        string memory _electionTitle,
        string memory _organizationTitle
    ) public onlyAdmin {
        electionDetails = ElectionDetails({
            adminName: _adminName,
            adminEmail: _adminEmail,
            adminTitle: _adminTitle,
            electionTitle: _electionTitle,
            organizationTitle: _organizationTitle
        });
        start = true;
        end = false;
    }

    //  get Election details
    function getElectionDetails()
        public
        view
        returns (
            string memory _adminName,
            string memory _adminEmail,
            string memory _adminTitle,
            string memory _electionTitle,
            string memory _organizationTitle
        )
    {
        return (
            electionDetails.adminName,
            electionDetails.adminEmail,
            electionDetails.adminTitle,
            electionDetails.electionTitle,
            electionDetails.organizationTitle
        );
    }

    function getAdmin() public view returns (address) {
        return i_admin;
    }

    // latter part
    // function setDates(uint256 _startDate, uint256 _endDate) public{
    //     require((votingEnd == 0) && (votingStart == 0) && (_startDate + 1000000 > now) && (_endDate > _startDate));
    //     votingEnd = _endDate;
    //     votingStart = _startDate;
    // }

    // function getDates() public view returns (uint256,uint256) {
    //   return (votingStart,votingEnd);
    // }
}
