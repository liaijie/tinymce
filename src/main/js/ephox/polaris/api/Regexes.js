define(
  'ephox.polaris.api.Regexes',

  [
    'global!RegExp'
  ],

  function (RegExp) {
    var link = function () {
     /* http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
        Modified to:
        - include port numbers
        - allow full stops in email addresses
        - allow -_.~*+=!&;:'%@?^${}()\w+, after the #
        - allow -_.~*+=!&;:'%@?^${}()\w+, after the ?
        - move allow -_.~*+=!&;:'%@?^${}() in email usernames to the first @ match (TBIO-4809)
        - enforce domains to be [A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+ so they can't end in a period (TBIO-4809)
        - removed a bunch of escaping, made every group non-capturing (during TBIO-4809)

      (?:
        (?:[A-Za-z]{3,9}:(?:\/\/)?)
        (?:[\-;:&=.+$,\w_~*+=!&;:'%@?^${}(),]+@)?
        [A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*
        |
          (?:www\.
          |
            [-;:&=+$,\w.]+@)
          [A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*
      )
      (?::[0-9]+)?
      (?:\/[+~%\/.()\w-_]*)?
      (?:\?(?:[\-_.~*+=!&;:'%@?^${}()\w,]*))?
      (?:#(?:[\-_.~*+=!&;:'%@?^${}()\w,\/]*))?

      */

      return /(?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=.+$,\w_~*+=!&;:'%@?^${}(),]+@)?[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*|(?:www\.|[-;:&=+$,\w.]+@)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)(?::[0-9]+)?(?:\/[+~%\/.()\w-_]*)?(?:\?(?:[-_.~*+=!&;:'%@?^${}()\w,]*))?(?:#(?:[-_.~*+=!&;:'%@?^${}()\w,\/]*))?/g;
    };

    var autolink = function () {
      /*
       * Takes the above link, and makes two additions:
       *
       * - allows punctuation at the end (so it can be used for TBIO autolink macro)
       * - wraps the link regex in a group so that match[1] returns the desired contents
       */
      var linksource = link().source;
      return new RegExp('(' + linksource + ')[\-_.~*+=!&;:\'%@?^${}(),]*', 'g');
    };

    var tokens = function (value, parameters) {
      return value.replace(/\{(\d+)\}/g, function (match, contents, offset, s) {
        var index = parseInt(contents, 10);
        if (parameters[index] === undefined) throw 'No value for token: ' + match + ' in translation: ' + value;
        return parameters[index];
      });
    };

    return {
      tokens: tokens,
      link: link,
      autolink: autolink
    };
  }
);