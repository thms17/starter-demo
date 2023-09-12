function init() {
  gsap.registerPlugin(ScrollTrigger);

  // select static and animated elements
  const imagineAnimated = document.getElementById('imagine-animated');
  const imagineStatic = document.getElementById('imagine-static');
  const buildAnimated = document.getElementById('build-animated');
  const buildStatic = document.getElementById('build-static');
  const tellAnimated = document.getElementById('tell-animated');
  const tellStatic = document.getElementById('tell-static');

  // split the text into words as spans
  const splitType = new SplitType('#words-to-split', { types: 'words' });

  // match positions
  matchLocation(imagineStatic, imagineAnimated);
  matchLocation(buildStatic, buildAnimated);
  matchLocation(tellStatic, tellAnimated);

  // hide static elements, make animated elements visible, avoids flashing of content
  gsap.set(imagineAnimated, { visibility: 'visible' });
  gsap.set(buildAnimated, { visibility: 'visible' });
  gsap.set(tellAnimated, { visibility: 'visible' });
  gsap.set(imagineStatic, { visibility: 'hidden' });
  gsap.set(buildStatic, { visibility: 'hidden' });
  gsap.set(tellStatic, { visibility: 'hidden' });

  // declare a timeline outside the createTimeline scope so we can access it in our resize function
  let tl;
  function createTimeline() {
    // if a timeline exists, we want to save its progress and kill it
    let progress = tl ? tl.progress() : 0;
    tl && tl.progress(0).kill();
    // create the timeline
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-track',
        start: 'top top', // then top of trigger div is at top of viewport
        end: 'bottom bottom', // when bottom of trigger div is at bottom of viewport
        scrub: 1,
      },
    });

    tl.to(splitType.words, {
      // whooshing words
      opacity: 0,
      rotationZ: 30,
      rotationX: 40,
      yPercent: -300,
      xPercent: 100,
      stagger: 0.05,
    })
      // start sending animated text to its original position in x direction
      .to([imagineAnimated, buildAnimated, tellAnimated], {
        x: 0,
        duration: 2,
      })

      // start animating in y position with ease effect
      .to(
        [imagineAnimated, buildAnimated, tellAnimated],
        {
          y: 0,
          ease: 'sine.in',
          duration: 1,
        },
        '>-1'
      )
      // finish off with puntuation
      .to('.is-punctuation', {
        autoAlpha: 1,
        stagger: 0.5,
      });

    // new tween created with updated location, set progress.
    tl.progress(progress);
  }

  // create timeline on initial load
  createTimeline();

  function handleResize() {
    matchLocation(imagineStatic, imagineAnimated);
    matchLocation(buildStatic, buildAnimated);
    matchLocation(tellStatic, tellAnimated);

    // reacreate the timeline so it "knows" where the new element position is
    createTimeline();
  }

  // set the elements that will be animated to the same positin as their static partners
  function matchLocation(staticElement, animatedEl) {
    let boundsRel = staticElement.getBoundingClientRect();
    let boundsAbs = animatedEl.getBoundingClientRect();

    gsap.set(animatedEl, {
      x: '+=' + (boundsRel.left - boundsAbs.left),
      y: '+=' + (boundsRel.top - boundsAbs.top),
    });
  }
  window.addEventListener('resize', handleResize);
}

window.addEventListener('load', init);
