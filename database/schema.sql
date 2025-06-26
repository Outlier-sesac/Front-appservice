-- MS SQL Server 데이터베이스 스키마

-- 국회의원 테이블
CREATE TABLE Members (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Party NVARCHAR(100) NOT NULL,
    Region NVARCHAR(100) NOT NULL,
    Term INT NOT NULL,
    Committee NVARCHAR(MAX), -- JSON 형태로 저장
    ProfileImage NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 법안 테이블
CREATE TABLE Bills (
    Id NVARCHAR(50) PRIMARY KEY,
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(100),
    ProposedDate DATETIME2,
    Status NVARCHAR(20) CHECK (Status IN ('pending', 'passed', 'rejected')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 표결 기록 테이블
CREATE TABLE Votes (
    Id NVARCHAR(50) PRIMARY KEY,
    MemberId NVARCHAR(50) FOREIGN KEY REFERENCES Members(Id),
    BillId NVARCHAR(50) FOREIGN KEY REFERENCES Bills(Id),
    Position NVARCHAR(20) CHECK (Position IN ('agree', 'disagree', 'abstain')),
    VotedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 회의록 테이블
CREATE TABLE Transcripts (
    Id NVARCHAR(50) PRIMARY KEY,
    MemberId NVARCHAR(50) FOREIGN KEY REFERENCES Members(Id),
    Committee NVARCHAR(100),
    Date DATETIME2,
    Topic NVARCHAR(500),
    Content NVARCHAR(MAX),
    Summary NVARCHAR(MAX), -- AI 요약
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 군집화 결과 테이블
CREATE TABLE ClusteringResults (
    Id NVARCHAR(50) PRIMARY KEY,
    MemberId NVARCHAR(50) FOREIGN KEY REFERENCES Members(Id),
    ClusterNumber INT,
    CoordinateX FLOAT,
    CoordinateY FLOAT,
    Similarity FLOAT,
    ModelVersion NVARCHAR(50),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 사용자 프로필 테이블
CREATE TABLE UserProfiles (
    Id NVARCHAR(50) PRIMARY KEY,
    UserId NVARCHAR(100) UNIQUE,
    Preferences NVARCHAR(MAX), -- JSON
    InterestedIssues NVARCHAR(MAX), -- JSON
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 사용자 투표 기록 테이블
CREATE TABLE UserVotes (
    Id NVARCHAR(50) PRIMARY KEY,
    UserId NVARCHAR(100),
    BillId NVARCHAR(50) FOREIGN KEY REFERENCES Bills(Id),
    Position NVARCHAR(20) CHECK (Position IN ('agree', 'disagree', 'abstain')),
    Confidence FLOAT,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 채팅 기록 테이블
CREATE TABLE ChatMessages (
    Id NVARCHAR(50) PRIMARY KEY,
    UserId NVARCHAR(100),
    Message NVARCHAR(MAX),
    Response NVARCHAR(MAX),
    Context NVARCHAR(MAX), -- JSON
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 인덱스 생성
CREATE INDEX IX_Votes_MemberId ON Votes(MemberId);
CREATE INDEX IX_Votes_BillId ON Votes(BillId);
CREATE INDEX IX_Transcripts_MemberId ON Transcripts(MemberId);
CREATE INDEX IX_ClusteringResults_MemberId ON ClusteringResults(MemberId);
CREATE INDEX IX_UserVotes_UserId ON UserVotes(UserId);
CREATE INDEX IX_ChatMessages_UserId ON ChatMessages(UserId);
