jQuery(document).ready(function($){

	if ( !config.isShe ) return;

	/**
	 * Save like counts to storage and update rendered count with
	 * value from storage if that is higher. Prevents some problems
	 * with caching.
	 */
	var storage = Modernizr.localstorage ? $.localStorage : $.cookieStorage;
	if ( !storage ) return;
	if ( !storage.get('likes')) storage.set('likes' , {});

	var $buttons = $('.dot-irecommendthis' );

	$buttons.each ( function( index , button )
	{
		var $button = $(button);
		var $count = $('.dot-irecommendthis-count' , $button );
		var count = parseInt($count.text());
		var id = $button.attr('id');

		var storageId = 'likes.' + id;
		var storageItem = storage.get(storageId);
		if ( !storageItem ) storage.set(storageId , {});

		var storageCount = storage.get(storageId,'count');
		if ( storageCount )
		{
			storageCount = parseInt(storageCount);
			if ( storageCount > count )
			{
				count = storageCount;
				//$count.text ( storageCount );

                if(count < 10 && count != 0) {
                    $count.text(count + 10);
                } else {
                    $count.text ( storageCount );
                }
			}
		}

		if ( storage.get(storageId,'state') == 'active')
		{
			$button.addClass('active');
		}

		storage.set( storageId , 'count' , count );
		storage.set( storageId , 'state' , $button.hasClass('active')?'active':null );

		//

		$button.on('click',  function()
		{
			if ( $button.hasClass('active') ) return false;
			//
			$button.addClass('active');

			$.post(dot_irecommendthis.ajaxurl, { action:'dot-irecommendthis', recommend_id:id, suffix:'' }, function( newCount )
			{
				$button.attr('title','You already recommended this');
				//$count.html(newCount);

                var likeCount = parseInt($button.find('.dot-irecommendthis-count').text());

                if((likeCount-10) < 10 && likeCount != 0) {
                    $button.find('.dot-irecommendthis-count').text(likeCount+1)
                } else {
                    $count.html(newCount);
                }

				storage.set( storageId , 'count' , newCount );
				storage.set( storageId , 'state' , 'active' );
			});

			return false;
		});


        // set initial val
        if(count < 10 && count != 0) {
            $count.text (count + 10);
        }


	});
});