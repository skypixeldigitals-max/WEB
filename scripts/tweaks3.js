const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");

// 1. Portfolio subtitles: drop " · TYPE", keep location.
{
  const f = path.join(dir, "portfolio.html");
  let h = fs.readFileSync(f, "utf8");
  const before = (h.match(/ · /g) || []).length;
  h = h.replace(/ · [^<]*?<\/p>/g, "</p>");
  fs.writeFileSync(f, h);
  console.log("portfolio: removed", before, "type tags | remaining ·:", (h.match(/ · /g) || []).length);
}

// 2. Gallery subtitle map: drop " · TYPE" from the JS values.
{
  const f = path.join(dir, "gallery.html");
  let h = fs.readFileSync(f, "utf8");
  h = h.replace(/ · [^"]*?"/g, '"');
  fs.writeFileSync(f, h);
  console.log("gallery: remaining ·:", (h.match(/ · /g) || []).length);
}

// 3. Footer Contact + Social columns -> line-art icons (all pages).
const OLD = `                <div class="flex flex-col gap-5">
                    <span class="uppercase font-bold tracking-[0.2em] text-[13px] text-on-surface">Contact</span>
                    <a class="text-[15px] text-on-surface-variant hover:text-black transition-colors underline decoration-black/20 underline-offset-4 break-all" href="mailto:shakir.jamaldeen@gmail.com">shakir.jamaldeen@gmail.com</a>
                    <a class="text-[15px] text-on-surface-variant hover:text-black transition-colors" href="tel:+94777536266">+94 77 753 6266</a>
                </div>
                <div class="flex flex-col gap-5">
                    <span class="uppercase font-bold tracking-[0.2em] text-[13px] text-on-surface">Social</span>
                    <div class="flex flex-col gap-3 text-[15px] text-on-surface-variant">
                        <a class="hover:text-black transition-colors" href="https://www.instagram.com/shakir.jamaldeen/" rel="noopener" target="_blank">Instagram</a>
                        <a class="hover:text-black transition-colors" href="https://www.facebook.com/shakirjamaldeenphoto" rel="noopener" target="_blank">Facebook</a>
                    </div>
                </div>`;

const NEW = `                <div class="flex flex-col gap-5">
                    <span class="uppercase font-bold tracking-[0.2em] text-[13px] text-on-surface">Contact</span>
                    <a class="flex items-center gap-3 text-[15px] text-on-surface-variant hover:text-black transition-colors break-all" href="mailto:shakir.jamaldeen@gmail.com"><span class="material-symbols-outlined text-[19px] shrink-0">mail</span>shakir.jamaldeen@gmail.com</a>
                    <a class="flex items-center gap-3 text-[15px] text-on-surface-variant hover:text-black transition-colors" href="tel:+94777536266"><span class="material-symbols-outlined text-[19px] shrink-0">call</span>+94 77 753 6266</a>
                </div>
                <div class="flex flex-col gap-5">
                    <span class="uppercase font-bold tracking-[0.2em] text-[13px] text-on-surface">Social</span>
                    <div class="flex items-center gap-4 text-on-surface-variant">
                        <a class="hover:text-black transition-colors" href="https://www.instagram.com/shakir.jamaldeen/" rel="noopener" target="_blank" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[22px] h-[22px]"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg></a>
                        <a class="hover:text-black transition-colors" href="https://www.facebook.com/shakirjamaldeenphoto" rel="noopener" target="_blank" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" class="w-[22px] h-[22px]"><path d="M14 21v-7h2.4l.4-2.8H14V9.3c0-.8.22-1.35 1.4-1.35H17V5.4c-.3-.04-1.1-.13-2-.13-2 0-3.4 1.22-3.4 3.46v1.93H9v2.8h2.6V21H14z"/></svg></a>
                    </div>
                </div>`;

for (const file of ["index.html", "portfolio.html", "about.html", "gallery.html"]) {
  const f = path.join(dir, file);
  let h = fs.readFileSync(f, "utf8");
  const c = h.split(OLD).length - 1;
  if (c) { h = h.split(OLD).join(NEW); fs.writeFileSync(f, h); }
  console.log(file.padEnd(16), "footer icon block replaced:", c);
}
