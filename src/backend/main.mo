import Time "mo:core/Time";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Memory = {
    image : Storage.ExternalBlob;
    caption : Text;
  };

  stable var boyfriendName : Text = "";
  stable var birthdayMonth : Nat = 1;
  stable var birthdayDay : Nat = 1;
  stable var letter : [Text] = [""];
  stable var memories : [Memory] = [];

  public shared ({ caller }) func setBoyfriendName(name : Text) : async () {
    boyfriendName := name;
  };

  public query ({ caller }) func getBoyfriendName() : async Text {
    boyfriendName;
  };

  public shared ({ caller }) func setBirthday(month : Nat, day : Nat) : async () {
    if (month < 1 or day < 1 or month > 12 or day > 31) {
      return;
    };
    birthdayMonth := month;
    birthdayDay := day;
  };

  public shared ({ caller }) func setLetter(paragraphs : [Text]) : async () {
    if (paragraphs.size() != 4) {
      return;
    };
    letter := paragraphs;
  };

  public shared ({ caller }) func setMemories(items : [Memory]) : async () {
    if (items.size() > 6) {
      return;
    };
    memories := items;
  };

  public query ({ caller }) func getBirthday() : async (Nat, Nat) {
    (birthdayMonth, birthdayDay);
  };

  public query ({ caller }) func isTodayBirthday() : async Bool {
    let now = Time.now();
    let dayIntoYear = (now / 86_400_000_000_000) % 365;
    let currentMonth = dayIntoYear / 30 + 1;
    let currentDay = dayIntoYear % 30 + 1;
    currentMonth == birthdayMonth and currentDay == birthdayDay;
  };

  public query ({ caller }) func daysUntilNextBirthday() : async Int {
    let now = Time.now();
    let dayIntoYear = (now / 86_400_000_000_000) % 365;
    let currentMonth = dayIntoYear / 30 + 1;
    let currentDay = dayIntoYear % 30 + 1;

    let birthdayOfYear : Int = (birthdayMonth - 1) * 30 + birthdayDay;
    let currentDayOfYear : Int = (currentMonth - 1) * 30 + currentDay;

    if (birthdayOfYear >= currentDayOfYear) {
      birthdayOfYear - currentDayOfYear;
    } else {
      365 - (currentDayOfYear - birthdayOfYear);
    };
  };

  public query ({ caller }) func getLetter() : async [Text] {
    letter;
  };

  public query ({ caller }) func getMemories() : async [Memory] {
    memories;
  };
};
