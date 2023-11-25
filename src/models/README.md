# Data Model

```mermaid
erDiagram
  Politician ||--o{ Role: "has"
  Role }o--o| Party: "in a"
  Role }o--o| Assembly: "in a"
  Politician }o--o| Vote: "can"
  Politician }|--o| Bill: "can propose"
  Vote }|--|| Voting: "are couted toward"
  Bill ||--o{ Event: "goes through"
  Bill |o--o{ Bill: "can be merged to"
  Event }o--o| Bill: "can refer to"
  Event }o--o| Voting: "can refer to"

  Politician {
    string id PK "firstname-lastname"
    string prefix
    string firstname
    string lastname
    boolean isActive
    string avatar
    string sex
    Date birthdate
    string[] educations
    string[] previousOccupations
    number assetValue
    string debtValue
    Link[] contacts "label: string, url: string"
  }

  Role {
    string politicianId FK
    string partyId FK "only for party"
    string province "only for party"
    number electorialDistrict "only for party"
    string assemblyId FK "only for assembly"
    string role
    Date startedAt
    Date endedAt
  }

  Party {
    string name PK
    string color
    string logo
  }

  Assembly {
    string id PK
    string name
    string abbreviation
    string term
    Date startedAt
    Date endedAt
    string origin
    string[] mainRoles
  }

  Bill {
    number id PK
    string title
    string nickname
    string description
    string[] categories
    string status "inProgress | enacted | rejected | merged"
    Date proposedOn
    string proposedBy "politicians | cabinet | people"
    string[] proposedByPoliticianIds FK
    number proposedByAssemblyId FK
    PeopleProposer proposedByPeople "{ ledBy: string, signatoryCount: number}"
    Date enactedOn
    number mergedToBillId FK "for status merged"
  }

  Voting {
    number id PK
    string title
    string description
    string[] categories
    Date date
    string meetingType
    string[] participatedAssembleIds FK
    VoteOption[] voteOptions "DefaultVoteOption | {label: string, color: string}"
    string winningCondition
    string result "passed | failed | string (other result)"
    number relatedBillId FK
    string sourceUrl
    Link[] files "label: string, url: string, mediaType: string"
  }

  Vote {
    string politicianId FK
    string votingId FK
    number voteOptionIndex "refer to Voting"
  }

  Event {
    number eventId PK
    number billId FK
    Date date
    string type "hearing | mp1 | mp2 | mp3 | senate1 | senate2 | senate3 | royalAssent | enforcement | other"
    string title "for other"
    string description "for other"
    string status "succeed | in-progress | failed"
    string actionType "voted | merged | enforced"
    number votedInVotingId FK "for action voted"
    number mergedIntoBillId FK "for action merged"
    string enforcementDocumentUrl "for action enforced"
  }
```

- **Politician** = นักการเมือง
- **Role** = ตำแหน่ง
- **Party** = พรรค
- **Assembly** = กลุ่มคน เช่น สส. สว. ครม.
- **Bill** = ข้อเสนอกฏหมาย
- **Event** = เหตุการต่างๆ ระหว่างการเสนอกฏหมาย
- **Voting** = การลงมติ
- **Vote** = การลงคะแนน
