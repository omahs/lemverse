isModalOpen = template => {
  if (!template) return Session.get('modal');
  return Session.get('modal')?.template === template;
};

toggleModal = modalName => {
  if (Session.get('modal')?.template === modalName) Session.set('modal', null);
  else Session.set('modal', { template: modalName });
};

closeModal = () => Session.set('modal', undefined);

const keydownListener = e => {
  if (e.code !== 'Escape' || !Session.get('modal')) return;

  closeModal();
  game.scene.keys.WorldScene.enableKeyboard(true, true);
  document.activeElement.blur();
};

let modals = [];

Template.modalContainer.onCreated(() => {
  closeModal();
  document.addEventListener('keydown', keydownListener);

  Tracker.autorun(() => {
    const modal = Session.get('modal');

    // allow multiple modals opened at the same time
    if (modal) modals.push(modal);
    else {
      const modalClosed = modals.pop();
      if (modalClosed && modalClosed.append) {
        const previousModal = modals[modals.length - 1];
        if (previousModal) Session.set('modal', previousModal);
      } else modals = [];
    }
  });
});

Template.modalContainer.onDestroyed(() => {
  document.removeEventListener('keydown', keydownListener);
});

Template.modalContainer.events({
  'click .js-modal-background'() { closeModal(); },
});

Template.modalContainer.helpers({
  modal() { return Session.get('modal'); },
});

Template.modal.events({
  'click .js-modal-close'() { closeModal(); },
});
