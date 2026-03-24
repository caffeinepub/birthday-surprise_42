import Time "mo:core/Time";
import Int "mo:core/Int";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Memory = {
    imageData : Text;
    caption : Text;
  };

  var boyfriendName : Text = "";
  var birthdayMonth : Nat = 1;
  var birthdayDay : Nat = 1;
  var letter : [Text] = [""];
  var memories : [Memory] = [];

  public shared ({ caller }) func setBoyfriendName(name : Text) : async () {
    boyfriendName := name;
  };

  public query ({ caller }) func getBoyfriendName() : async Text {
    boyfriendName;
  };

  public shared ({ caller }) func setBirthday(month : Nat, day : Nat) : async () {
    if (month < 1 or month > 12) {
      return;
    };
    if (day < 1 or day > 31) {
      return;
    };
    birthdayMonth := month;
    birthdayDay := day;
  };

  public query ({ caller }) func getBirthday() : async (Nat, Nat) {
    (birthdayMonth, birthdayDay);
  };

  public query ({ caller }) func isTodayBirthday() : async Bool {
    let now = Time.now();
    let daysSinceEpoch = now / 86_400_000_000_000;
    let daysIntoYear = daysSinceEpoch % 365;
    let currentMonth = daysIntoYear / 30 + 1;
    let currentDay = daysIntoYear % 30 + 1;

    currentMonth == birthdayMonth and currentDay == birthdayDay;
  };

  public query ({ caller }) func daysUntilNextBirthday() : async Int {
    let now = Time.now();
    let daysSinceEpoch = now / 86_400_000_000_000;
    let daysIntoYear = daysSinceEpoch % 365;
    let currentMonth = daysIntoYear / 30 + 1;
    let currentDay = daysIntoYear % 30 + 1;

    let birthdayOfYear = (birthdayMonth - 1) * 30 + birthdayDay;
    let currentDayOfYear = (currentMonth - 1) * 30 + currentDay;

    if (birthdayOfYear >= currentDayOfYear) {
      birthdayOfYear - currentDayOfYear;
    } else {
      365 - (currentDayOfYear - birthdayOfYear);
    };
  };

  public shared ({ caller }) func setLetter(paragraphs : [Text]) : async () {
    if (paragraphs.size() != 4) {
      return;
    };
    letter := paragraphs;
  };

  public query ({ caller }) func getLetter() : async [Text] {
    letter;
  };

  public shared ({ caller }) func setMemories(items : [Memory]) : async () {
    if (items.size() > 6) {
      return;
    };
    memories := items;
  };

  public query ({ caller }) func getMemories() : async [Memory] {
    memories;
  };
};
