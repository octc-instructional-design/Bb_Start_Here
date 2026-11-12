/* Navigation for the student learning resources. Keep these paths stable for Blackboard links. */
(() => {
  const groups = [
    ["Learning in Blackboard","learning-in-blackboard.html",[["Get Started in Blackboard","blackboard-get-started.html"],["Find Course Materials & Deadlines","blackboard-course-materials-and-deadlines.html"],["Submit Work & Take Tests","blackboard-submit-work-and-take-tests.html"],["Join a Discussion","blackboard-discussions.html"],["Check Grades & Feedback","blackboard-grades-and-feedback.html"],["Use Ally Alternative Formats","ally-alternative-formats.html"]]],
    ["Study & Stay on Track","study-stay-on-track.html",[["Make Online Learning Work for You","online-learning-success.html"],["Plan Your Week","plan-your-week.html"],["Understand Your Grades","understand-your-grades.html"],["Use Sources and Tools Responsibly","use-sources-responsibly.html"],["Citation Help: MLA or APA?","citation-help.html"]]],
    ["Library & Research", "library-research.html", []],
    ["Communicate & Participate","communicate-participate.html",[["Classroom Participation","classroom-participation.html"],["Discussion Boards","discussion-boards.html"],["Email Your Instructor","email-your-instructor.html"],["Report Problems Early","report-course-problems.html"],["Give Useful Course Feedback","give-course-feedback.html"]]],
    ["Technology Tips & Help","technology-tips.html",[["Browser Troubleshooting","browser-troubleshooting.html"],["Chromebook Tips","chromebook-tips.html"],["Textbooks & Course Materials","textbooks-course-materials.html"],["Publisher & Ebook Support","publisher-support.html"],["Microsoft 365 Help","microsoft-365-help.html"],["Google Files to Blackboard","google-files-for-blackboard.html"],["Recording and Submitting Video","recording-tools.html"],["Respondus LockDown Browser","respondus-lockdown-browser.html"],["Using Padlet","padlet.html"]]],
    ["Student Support","student-support.html",[]],
    ["AI Literacy","ai-literacy.html",[["Before you ask","ai-before-you-ask.html"],["Before you use it","ai-before-you-use-it.html"],["Before you turn it in","ai-before-you-turn-it-in.html"],["Keep a trail of your work","ai-keep-a-trail.html"],["Ask for the Help You Actually Need","ai-prompting-tips.html"],["AI Creep Meter","ai-creep-meter.html"],["AI Tools for Students","ai-tools-for-students.html"]]],
    ["Skills for Life & Work","essential-skills.html",[]],
    ['Plan Your Transfer', 'https://kctcs.edu/education-training/transfer/', []],
    ['Student Wellness', 'student-wellness.html', []]
  ];
  const home = ['Table of Contents', 'student-resources.html'];
  const sequence = [home, ...groups.filter(([, href]) => !href.startsWith('https://')).flatMap(([title, href, children]) => [[title, href], ...children])];
  const current = location.pathname.split('/').pop();
  const index = sequence.findIndex(([, href]) => href === current);
  const main = document.querySelector('main');
  if (!main || (index < 0 && current !== 'academic-success.html')) return;

  const element = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  };
  const link = ([title, href], className) => {
    const a = element('a', className, title);
    a.href = href;
    if (href.startsWith('https://')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', title + ' (opens in a new tab)');
    }
    if (href === current) a.setAttribute('aria-current', 'page');
    return a;
  };
  const sidebar = element('aside', 'handbook-sidebar');
  const menu = element('details', 'handbook-menu');
  const summary = element('summary', '', 'Learning Tools & Support');
  const nav = element('nav', 'handbook-nav');
  nav.setAttribute('aria-label', 'Learning Tools & Support topics');
  const list = element('ol', 'handbook-chapters');
  nav.append(element('div', 'handbook-brand', 'OCTC · START HERE'), link(home, 'handbook-home'));
  groups.forEach(([title, href, children], i) => {
    const row = element('li', 'handbook-group');
    const chapter = link([title, href], 'handbook-chapter');
    const number = element('span', 'handbook-number', String(i + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    chapter.prepend(number);
    row.append(chapter);
    const isCurrentGroup = current === href || children.some(([, child]) => child === current);
    if (isCurrentGroup && children.length) {
      const topics = element('ul', 'handbook-topics');
      children.forEach(topic => {
        const item = element('li');
        item.append(link(topic));
        topics.append(item);
      });
      row.append(topics);
    }
    list.append(row);
  });
  nav.append(list);
  menu.append(summary, nav);
  sidebar.append(menu);

  const skip = element('a', 'handbook-skip', 'Skip to main content');
  main.id ||= 'handbook-content';
  main.tabIndex = -1;
  skip.href = '#' + main.id;
  document.body.prepend(skip, sidebar);
  document.body.classList.add('handbook-page');
  if (index !== 0) {
    const header = main.querySelector('header');
    if (header) {
      const backHome = link(['Home', home[1]], 'handbook-home-link');
      backHome.setAttribute('aria-label', 'Home: Learning Tools & Support');
      const ns = 'http://www.w3.org/2000/svg';
      const icon = document.createElementNS(ns, 'svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      const outline = document.createElementNS(ns, 'path');
      outline.setAttribute('d', 'm3 10 9-7 9 7M5 9v12h5v-6h4v6h5V9');
      icon.append(outline);
      backHome.prepend(icon);
      header.prepend(backHome);
    }
  }
  if (index > 0) {
    const chapterIndex = groups.findIndex(([, href, children]) => href === current || children.some(([, child]) => child === current));
    const title = main.querySelector('h1');
    title?.before(element('p', 'handbook-kicker', 'Chapter ' + String(chapterIndex + 1).padStart(2, '0') + ' · Learning Tools & Support'));
    const pager = element('nav', 'handbook-pager');
    pager.setAttribute('aria-label', 'Previous and next topics');
    [sequence[index - 1], sequence[index + 1]].forEach((page, i) => {
      if (!page) return;
      const a = link(page, i ? 'handbook-next' : 'handbook-previous');
      a.prepend(element('span', '', i ? 'Next →' : '← Previous'));
      pager.append(a);
    });
    main.append(pager);
  }
  const footer = element('footer', 'handbook-footer');
  const feedback = element('p', 'handbook-footer-feedback', 'Suggest an addition or correction: ');
  const priorFeedback = main.querySelector('.resource-feedback');
  const subject = 'OCTC Learning Tools & Support — Suggestion or Correction';
  const contact = link(['email Stephanie Self', 'mailto:stephanie.self@kctcs.edu?subject=' + encodeURIComponent(subject)]);
  feedback.append(contact, '.');
  priorFeedback?.remove();
  const version = element('p', 'handbook-version', 'VERSION: Fall 2026');
  const updated = main.querySelector('[data-last-updated]');
  const meta = element('div', 'handbook-footer-meta');
  meta.append(version);
  if (updated) meta.append(updated);
  footer.append(feedback, meta);
  main.after(footer);

  const wide = matchMedia('(min-width: 850px)');
  const sync = () => { menu.open = wide.matches; };
  sync();
  wide.addEventListener('change', sync);
})();
