import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

export function getFilesInFolder(folderPath) {
  let folder = Gio.File.new_for_path(folderPath);
  let files = folder.enumerate_children(
    "*",
    Gio.FileQueryInfoFlags.NONE,
    null,
  );
  let file = files.next_file(null);

  let fileNames = [];

  while (file !== null) {
    if (file.get_file_type() === Gio.FileType.DIRECTORY)
      fileNames.push({
        name: file.get_name(),
        icon: file.get_icon(),
        hidden: file.get_is_hidden(),
        time:
          (file.get_modification_date_time() ??
          file.get_creation_date_time() ??
          GLib.DateTime.new_from_unix_utc(0)).to_unix(),
      });
    file = files.next_file(null);
  }

  return fileNames.sort((a,b) => b.time - a.time);
}

export function indexObjects(array) {
  return array.map(item => {
    const mainRow = new Gtk.ListBoxRow();

    const itemBox = new Gtk.Box({
      marginBottom: 12,
      marginEnd: 12,
      marginStart: 12,
      marginTop: 12,
      spacing: 16,
    });

    let iconConfig = {
      icon_size: Gtk.IconSize.LARGE,
      name: "stridersBeats"
    };

    iconConfig.icon_name = item.icon?.to_string()?.split(" ")[3] ?? "folder";

    const innerImage = new Gtk.Image(iconConfig);

    itemBox.append(innerImage);

    const nameBox = new Gtk.Box({
      hexpand: true,
      orientation: 1,
      spacing: 4,
    });

    const name = new Gtk.Label({
      cssClasses: ["heading"],
      ellipsize: "end",
      label: item.name,
      valign: "baseline",
      xalign: 0.0,
    });

    nameBox.append(name);

    const path = new Gtk.Label({
      cssClasses: ["dim-label"],
      ellipsize: "end",
      label: GLib.DateTime.new_from_unix_utc(item.time).format("%x, %X"),
      valign: "baseline",
      xalign: 0.0,
    });

    nameBox.append(path);

    itemBox.append(nameBox);

    mainRow.set_child(itemBox);

    return mainRow;
  })
}

