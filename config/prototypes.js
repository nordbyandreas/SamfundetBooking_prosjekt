
////////////////////////////////////////////////////////////
// Prototypes
////////////////////////////////////////////////////////////

// String function for replacing all instances of a substring with another string. Applies for all string objects.
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

