var app = angular.module('varta.controllers', [])

/**
 *
 * Main Controller
 */

  .controller('AppCtrl', function ($scope, $cordovaSocialSharing, $cordovaInAppBrowser, $cordovaGoogleAnalytics, $timeout,$window,fbLikeService) {


    //Share AnyWhere Function
    var shareTitle = 'ગુજરાતી વાર્તાઓ ની સૌથી વિશાળ એપ્લીકેશન, તદન મફત મેળવો, જેમાં અકબર બીરબલ ની વાર્તાઓ, બોધ કથાઓ, શૈલેશભાઈ ની આજ ની વાર્તા, દાદા દાદી ની વાર્તાઓ, પંચતંત્ર ની વાર્તાઓ અને બીજી ઘણી વાર્તાઓ છે. શેર કરો અને ઇનામો જીતવાનો પણ મૌકો મળશે. વધુ વિગત માટે એપ્લીકેશન ડાઉનલોડ કરો, ક્લિક કરો અને હા આ મેસેજ બધા ગુજરાતીઓ સાથે અચૂક શેર કરજો. જય જય ગરવી ગુજરાત.';
    $scope.shareAnywhere = function () {

      $timeout(function () {
        $cordovaSocialSharing.share(shareTitle, null, null, "http://bit.ly/1TOaeCn ");
      }, 300);

    };

    // Rate us Function

    $scope.RateUs = function () {
      
        window.open('market://details?id=com.deucen.gujaratistoriesvartao', '_system', 'location=yes');
        //$cordovaInAppBrowser.open('https://play.google.com/store/apps/details?id=com.deucen.netyatraa', '_blank', options);
    }

//       AppRate.preferences = {
//       openStoreInApp: true,
//       useCustomRateDialog: false,
//       displayAppName: 'Net Yatra',
//       // usesUntilPrompt: 5,
//       promptAgainForEachNewVersion: false,
//       storeAppURL: {
//       ios: '<my_app_id>',
//       android: 'market://details?id=com.deucen.netyatraa',
//       windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
//       blackberry: 'appworld://content/[App Id]/',
//       windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
//     },
//     customLocale: {
//       title: "Rate us",
//       message: "Would you like to Rate us ?",
//       cancelButtonLabel: "No, Thanks",
//       laterButtonLabel: "Remind Me Later",
//       rateButtonLabel: "Rate It Now"
//     }
// };

//     AppRate.promptForRating(true);


    

//  Like us on Facebook

    $scope.likeUsOnFb = function () {
        fbLikeService.openWindow().then(function(d){
          // console.log('sucess',d);
        },function(e){
          // console.log('error',e);
          $window.open('https://www.facebook.com/1519563958349711', '_system', 'location=yes');
        })

    };


    //Our More Apps

    $scope.ourMoreApps = function () {
     
        $window.open('market://search?q=pub%3ADeuceN%20Tech&c=apps', '_system', 'location=yes');

    }


  })



  /**
   *
   * Home Controller
   *
   */

  .controller('homeCtrl', function (showLoading, $localStorage,$cordovaSQLite ,httpRequest, alertService, stopLoading, $http, $state, $timeout, $scope, bannerAd) {

    var _self = this;
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      bannerAd.hideBanner();

    });
    // handle event
    _self.desibleLoadBtn = false;
    var c;
    var totalCounts;

    _self.load = function () {
      showLoading.show();
      c = 10;
      httpRequest.httpFunc().then(function (d) {
        stopLoading.hide();
        // $localStorage.allPost = d.data.posts;
        _self.data = d.data.posts;
        totalCounts = d.data.count_total;

      }, function (e) {
        stopLoading.hide();
        alertService.showAlert('Error', "Make Sure you have working Internet Connections");

      //  _self.data =  $localStorage.allPost;
      var arr = [];
        var query = "SELECT * FROM allPosts";
          $cordovaSQLite.execute(db, query).then(function(res) {
              if(res.rows.length > 0) {
              //  / // console.log('allPost',res);
                 
                for(var i = 0; i < res.rows.length; i++){
                // console.log("HOme Ctrl All Post Recivedd " + res.rows.item(i).post + " " , res.rows.item(i));
                var post = JSON.parse(res.rows.item(i).post);
                arr.push(post);
                // console.log('posts',arr);
                _self.data = arr;
              } 
                
            } else {
                // console.log("No results found");
               
               
                
            }
          },function(e) {
            // console.log('eerror',e);
          }) 


      })
    };
    _self.load();

    _self.loadMore = function () {

      showLoading.show();
      c = c + 10;

      $http.get(WordPress_url +'/?json=get_recent_posts&count=' + c).then(function (r) {
        // console.log('sending posts are ', r);.
        stopLoading.hide();

        _self.data = r.data.posts;
        if (r.data.count == totalCounts) {
          alertService.showAlert('Sorry', "Sorry no more data is avalible");
        }
      }, function (e) {
        stopLoading.hide();
        alertService.showAlert('Error', "Make Sure you have working Internet Connections");
      });

    };


    _self.gotopostDetail = function (data) {

      var jsonString = JSON.stringify(data);

      $state.go('menu.postDetail', {postID: jsonString});
    }
  })


  /**
   *
   * categoryCtrl
   *
   */
  
  .controller('categoryCtrl', function ($localStorage,$timeout,$ionicPlatform ,$http, $cordovaSQLite ,$stateParams, $cordovaLocalNotification, showLoading, httpRequest, alertService, stopLoading, $state, $scope, $rootScope) {

    var _self = this;

    var totalPost;
    showLoading.show();
    $http.get(WordPress_url +'/?json=get_category_index').then(function (d) {
      // $localStorage.categoryData = d.data.categories;
      // console.log('d',d);
      _self.data = d.data.categories;
      var data = d.data.categories;
      // console.log('data',data);
           stopLoading.hide();
      $ionicPlatform.ready(function(){
      var query = "SELECT * FROM allCategories";
          $cordovaSQLite.execute(db, query).then(function(res) {
              if(res.rows.length > 0) {
                // console.log('allPost',res);
                
            } else {
                // console.log("No results found");
                //  categories (title) VALUES (?)
              var query2 = "INSERT INTO allCategories (categories) VALUES (?)";
                $cordovaSQLite.execute(db, query2, [JSON.stringify(data)]).then(function(res) {
                        // console.log(" category id INSERT ID -> " + res.insertId);
                    }, function (err) {
                        // console.log(err);
                    });     
                
            }
          },function(e) {
            // console.log('eerror',e);
          })  
      })
       
      
      
      
      
      
      
      stopLoading.hide();
    }, function (e) {
      stopLoading.hide();
       alertService.showAlert('Error', 'Make sure you have working internet connection');     
     
      // _self.data = $localStorage.categoryData;
     
     $ionicPlatform.ready(function(){

            var query = "SELECT * FROM allCategories";
            // var arr = [];
          $cordovaSQLite.execute(db, query).then(function(res) {
              if(res.rows.length > 0) {
                // console.log('allPost',res);
                for(var i = 0; i < res.rows.length; i++){
                // console.log("Category Detail Ctrl All categories Recivedd " + res.rows.item(i).categories + " " , res.rows.item(i));
                var post = JSON.parse(res.rows.item(i).categories);
             
                _self.data = post;
              }
                
                
            } else {
                // console.log("No results found");
                
                
            }
          },function(e) {
            // console.log('eerror',e);
          }) 
       
       
     });

     
    });
    
    _self.showCategoryDetail = function (id,title) {
   
      var jsonString = JSON.stringify(title);
     $state.go('menu.categoryDetail',{category:id,title:title});		    
		
      };		     
  })  

    //   //Ye code UNIQUE kar raha hai
    //   for(var i=0;i<_self.data.length;i++){
    //     var arr = _self.data[i].categories;
    //     for(var j=0;j<arr.length;j++){
    //       var arr2 = arr[j].id;
    //       if(_self.myArray.indexOf(arr2)==-1){
    //         _self.myArray.push(arr2);
    //         arr[j].status = true;
    //       }else {
    //         arr[j].status = false;
    //       }
    //     }
    //   }
    //   stopLoading.hide();
    //   },function(e){
    //     stopLoading.hide();
    //   alertService.showAlert('Error!', "Make sure you are connected to internet")
    //   })

    // }, function (e) {
    //   stopLoading.hide();
    //   alertService.showAlert('Error!', "Make sure you are connected to internet");
    // });
    
    
    
    
  /**
   *
   *  Category Detail Ctrl
   *
   */

  .controller('categoryDetailCtrl', function ($localStorage, $stateParams, $scope, $state, $http, showLoading, alertService, stopLoading, $timeout, bannerAd) {

    var _self = this;
    var count;
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      bannerAd.hideBanner();

    });


    _self.data = JSON.parse($stateParams.category);
    _self.title = $stateParams.title
    // console.log('self data',_self.data);
    showLoading.show();
    $http.get(WordPress_url +'/?json=get_category_posts&id=' + _self.data).then(function (d) {
      //  console.log('_self.data',d);
      // $localStorage.categoryDetailTitle = d.data.data.varta_lists;
      $localStorage.categoryDetailArray = d.data.posts;
      // $localStorage.categoryDetailCount = d.data.count;

      // _self.title = $localStorage.categoryDetailTitle;
      // _self.categoryArray = $localStorage.categoryDetailArray;
      // count = $localStorage.categoryDetailCount;

      // _self.title = d.data.data.varta_lists;
      _self.categoryArray = $localStorage.categoryDetailArray;
     
       stopLoading.hide();




     
      count = d.data.count;
      $timeout(function () {
        stopLoading.hide();
      }, 4000)

    }, function (err) {
      stopLoading.hide();
      alertService.showAlert('Error', "Make sure you have working internet connection");
      // _self.title = $localStorage.categoryDetailTitle;
      _self.categoryArray = $localStorage.categoryDetailArray;
    });

    _self.loadMore = function () {

      showLoading.show();
      count = count + 10;

      $http.get(WordPress_url +'/?json=get_category_posts&id=' + _self.data + '&count=' + count).then(function (r) {
        // $localStorage.categoryDetailArray = r.data.posts;
        _self.categoryArray = r.data.posts;

        $timeout(function () {
          stopLoading.hide();
        }, 4000)


      }, function (e) {
        stopLoading.hide();
        alertService.showAlert('Error', "Make Sure you have working Internet Connections");
        // _ self.categoryArray = $localStorage.categoryDetailArray;
      });

    };


    _self.gotoCategoryDetail = function (d) {

      var jsonString = JSON.stringify(d);


      $state.go('menu.postDetail', {postID: jsonString});


    }


  })











  /**
   *
   * Post Detail Controller
   *
   */

  .controller('postDetailCtrl', function ($scope, $localStorage,$cordovaSQLite ,$stateParams, $rootScope, StorageService, alertService, $cordovaSocialSharing, showLoading, $timeout, stopLoading, bannerAd, $ionicPlatform, $ionicHistory, $http) {

    var _self = this;
    var params = $stateParams.postID;
    var jsonParse = JSON.parse(params);
    // console.log('post detail ctrl')
    $ionicPlatform.onHardwareBackButton(function () {
      // console.log('show the inter 1')

      bannerAd.showInter();
      bannerAd.hideBanner();
      $ionicHistory.goBack();
    });

    _self.back = function () {
      //  console.log('show the inter 1')
      bannerAd.showInter();
      bannerAd.hideBanner();
      $ionicHistory.goBack();
    };
    _self.postTitle = jsonParse.title;
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // console.log('post detail ctrl')
     
      showLoading.show();
      // 
    //  console.log('post works')
    //   _self.postDetailArray = StorageService.getAll();
    //   var getSpecific = _self.postDetailArray;
    //   console.log('getting ',getSpecific)
    //   for (var i = 0; i < getSpecific.length; i++) {
    //     var jsonID = jsonParse.id;
    //     var speci = getSpecific[i].id;
    // console.log('jsonID',jsonID,'speci',speci);
    //     if (jsonID == speci) {
    //       _self.bookmarked = true;

    //     }
    //     else {
    //       _self.bookmarked = false;
    //     }
    //   }
     var bookmarkArray = [];
      var query = "SELECT * FROM bookmark";
          $cordovaSQLite.execute(db,query).then(function(res){
            
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++){
                // console.log("Category Detail Ctrl All categories Recivedd " + res.rows.item(i).bookmark + " " , res.rows.item(i));
                var post = JSON.parse(res.rows.item(i).bookmark);
                _self.id = JSON.parse(res.rows.item(i).id);
                bookmarkArray.push(post);
                // console.log('post',post,'bookmarkArray',bookmarkArray);
                
                for(var i = 0; i < bookmarkArray.length; i++){
                  var jsonID = jsonParse.id;
                  var speci = bookmarkArray[i].id;
                  // console.log('jsonID',jsonID);
                  // console.log('speci',speci);
                  if(jsonID == speci){
                    _self.bookmarked = true;
                  }
                  else{
                    _self.bookmarked = false;
                  }
                  
                }
                
              }
                
            } else {
                // console.log("No results found");
                
            }
            
          },function(e){
            
          })
    
    
    
    
    
    
      bannerAd.banner();
    });

    $timeout(function () {
      stopLoading.hide();
    }, 2000);


    /**
     * Facebook Share Function
     *
     */


    _self.shareFb = function (msg) {
      var output = msg.replace(/(<([^>]+)>)/ig, "");

      $cordovaSocialSharing.shareViaFacebook(jsonParse.title +" " + " આખી વાર્તા વાંચવા ક્લિક કરો: http://bit.ly/1TOaeCn અને ગુજરાતી વાર્તાની બેસ્ટ એપ્લીકેશન ડાઉનલોડ કરી લો", null, "http://bit.ly/1TOaeCn ")
        .then(function (s) {
        }, function (e) {
        });
    };

    _self.shareAnyWhere = function (d) {
      setTimeout(function () {
        $cordovaSocialSharing.share(jsonParse.title +" " + " આખી વાર્તા વાંચવા ક્લિક કરો: http://bit.ly/1TOaeCn અને ગુજરાતી વાર્તાની બેસ્ટ એપ્લીકેશન ડાઉનલોડ કરી લો", null, null, "http://bit.ly/1TOaeCn");
      }, 300);
    };


    var ps = JSON.stringify(jsonParse.content);

    _self.content = jsonParse.content;

    _self.fullDetail = jsonParse;


    _self.bookmark = function (d) {


              var query = "INSERT INTO bookmark (bookmark) VALUES (?)";
                $cordovaSQLite.execute(db, query, [JSON.stringify(d)]).then(function(res) {
                        // console.log(" category id INSERT ID -> " + res.insertId);
                     _self.bookmarked = true;
                  alertService.showAlert('Success !', 'successfully Bookmarked');
                    }, function (err) {
                        // console.log(err);.
                   alertService.showAlert('Error !', 'Error getting Bookmarked')

              });    


      // StorageService.add(d).then(function (s) {

      //   _self.bookmarked = true;
      //   alertService.showAlert('Success !', 'successfully Bookmarked');
      // }, function (e) {
      //   alertService.showAlert('Error !', 'Error getting Bookmarked')
      // });

      // var getting = StorageService.getAll();


    };

    _self.remove = function (d) {
      _self.bookmarked = false;
      
      
      var query = "DELETE FROM bookmark WHERE id = ?;"
                  $cordovaSQLite.execute(db,query,[d]).then(function(s){
                    // console.log('successfully Removed',s);
                 alertService.showAlert('Success !', 'SuccessFully Remove Bookmarked')          
                  },function(e){
                    // console.log('getting error while removed',e);
                    alertService.showAlert('Error !', 'Error in removing');
                  })
      
      
      // StorageService.remove(d).then(function (s) {
      //   alertService.showAlert('Success !', 'SuccessFully Remove Bookmarked')
      // }, function (e) {
      //   alertService.showAlert('Error !', 'Error in removing');
      // });
    }
  })


  /**
   *
   * bookmarkCtrl
   *
   */

  .controller('bookmarkCtrl', function ($localStorage, $scope ,$cordovaSQLite ,$stateParams, StorageService, $state) {
    var _self = this;
    // _self.data = [];
    // $localStorage.bookmarkArray = StorageService.getAll();
    // _self.data = StorageService.getAll();
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
           var bookmarkArray = [];
         _self.noBookmarked = false;

             var query = "SELECT * FROM bookmark";
             $cordovaSQLite.execute(db,query).then(function(res){
            
            if(res.rows.length > 0) {
                // console.log('allPost',res);
                for(var i = 0; i < res.rows.length; i++){
                // console.log("Category Detail Ctrl All categories Recivedd " + res.rows.item(i).categories + " " , res.rows.item(i));
                var post = JSON.parse(res.rows.item(i).bookmark);
                bookmarkArray.push(post);
                // console.log('post',post,'bookmarkArray',bookmarkArray);
                _self.data = bookmarkArray;
                
              }
                
                
            } else {
                 _self.data = [];
                //  console.log("No results found");
                 _self.noBookmarked = true;

                
            }
            
          },function(e){
            
          })
    });
   
    
    
    
    
    

    _self.gotopostDetail = function (data) {

      var jsonString = JSON.stringify(data);
      $state.go('menu.postDetail', {postID: jsonString});
    }

  })




  /**
   *
   * About Controller
   *
   */


  .controller('aboutCtrl', function () {


    var _self = this;
    _self.content = "મિત્રો, કહેવાય છે કે વાર્તા તો માતૃભાષા માં જ વાંચવી, સાંભળવી અને સંભળાવવી જોઈએ, તો જ વાર્તા ની સાચી મજ્જા છે. આજે જયારે દરેક દાદી, દાદા, મમ્મી , પપ્પા અને બાળકોના હાથમાં પણ જયારે મોબાઈલ અને ટેબ્લેટ આવી ગયા છે ત્યારે વાર્તા પણ હાથ માં જ હોય તો વાંચવાની વધુ મજ્જા આવે, બરોબર ને.અમે 'વાર્તા રે વાર્તા' નામ ની એપ્લીકેશન થકી તમારા માટે એ તમામ વાર્તાઓ લાવ્યા છીએ કે જે દરેક ગુજરાતીએ વાંચવી જ જોઈએ અને ગુજરાતી બાળકો ને રોજ રાત્રે સુતા પહેલા સંભળાવવી જોઈએ. બાળવાર્તાઓ થી લઈને બોધ કથાઓ, અકબર બીરબલ ની વાર્તાઓ, રહસ્ય વાર્તાઓ, શૈલેશ સગપરીયા ની પ્રખ્યાત બોધ કથાઓ, ધાર્મિક કથાઓ વિગેરે ઉપલબ્ધ રહેશે.મિત્રો, અમે પસંદ કરેલ ઘણી વાર્તાઓ ઈન્ટરનેટ ઉપર થી લીધેલ હોઈ, એનાથી જો કોઈ કોપી રાઈટ નું ઉલંઘન થયેલ હોય તો અમે દિલગીર છીએ અને આપ અમને જાણ કરશો તો અમે એ વાર્તા દુર કરી દઈશું. અમારો ઉદેશ ફક્ત અને ફક્ત ગુજરાતી વાર્તાઓ વધુમાં વધુ ગુજરાતી મિત્રો સુધી પહોંચાડવાનો છે. અને હા મિત્રો, અમારી આ એપ્લીકેશન દરેક ગુજરાતી મિત્રો સાથે શેર કરવા વિનંતી. આભાર. વાંચે ગુજરાત, વંચાવે ગુજરાત";
 })
  
