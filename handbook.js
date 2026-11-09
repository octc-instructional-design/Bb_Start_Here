/* Navigation for the student learning resources. Keep these paths stable for Blackboard links. */
(() => {
  const groups = [
    ['Learning in Blackboard', 'learning-in-blackboard.html', [
      ['Using Padlet', 'padlet.html'], ['Ally alternative formats', 'ally-alternative-formats.html']]],
    ['Technology Tips & Help', 'technology-tips.html', [
      ['Chromebook tips', 'chromebook-tips.html'], ['Google Files to Blackboard', 'google-files-for-blackboard.html'],
      ['Recording and submitting video', 'recording-tools.html'], ['Respondus LockDown Browser', 'respondus-lockdown-browser.html']]],
    ['Academic Success & Communication', 'academic-success.html', [
      ['Make online learning work for you', 'online-learning-success.html'], ['Citation help: MLA or APA?', 'citation-help.html']]],
    ['Student Support', 'student-support.html', []],
    ['Skills for Life & Work', 'essential-skills.html', []],
    ['AI Literacy', 'ai-literacy.html', [
      ['Before you ask', 'ai-before-you-ask.html'], ['Before you use it', 'ai-before-you-use-it.html'],
      ['Before you turn it in', 'ai-before-you-turn-it-in.html'], ['Keep a trail of your work', 'ai-keep-a-trail.html']]]
  ];
  const home = ['Table of Contents', 'student-resources.html'];
  const sequence = [home, ...groups.flatMap(([title, href, children]) => [[title, href], ...children])];
  const current = location.pathname.split('/').pop();
  const index = sequence.findIndex(([, href]) => href === current);
  const main = document.querySelector('main');
  if (index < 0 || !main) return;

  const element = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  };
  const link = ([title, href], className) => {
    const a = element('a', className, title);
    a.href = href;
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
  const wide = matchMedia('(min-width: 850px)');
  const sync = () => { menu.open = wide.matches; };
  sync();
  wide.addEventListener('change', sync);
})();
