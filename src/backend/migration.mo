module {
  type Memory = {
    imageData : Text;
    caption : Text;
  };

  type OldActor = {
    boyfriendName : Text;
    birthdayMonth : Nat;
    birthdayDay : Nat;
  };

  type NewActor = {
    boyfriendName : Text;
    birthdayMonth : Nat;
    birthdayDay : Nat;
    letter : [Text];
    memories : [Memory];
  };

  public func run(old : OldActor) : NewActor {
    { old with letter = [""]; memories = [] };
  };
};
