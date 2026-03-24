import Storage "blob-storage/Storage";

module {
  type OldMemory = {
    imageData : Text;
    caption : Text;
  };

  type NewMemory = {
    image : Storage.ExternalBlob;
    caption : Text;
  };

  type OldActor = {
    boyfriendName : Text;
    birthdayMonth : Nat;
    birthdayDay : Nat;
    letter : [Text];
    memories : [OldMemory];
  };

  type NewActor = {
    boyfriendName : Text;
    birthdayMonth : Nat;
    birthdayDay : Nat;
    letter : [Text];
    memories : [NewMemory];
  };

  public func run(old : OldActor) : NewActor {
    { old with memories = [] };
  };
};
