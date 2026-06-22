
insert into public.website_projects (
  slug, image_url, category_key, year, metric, featured, sort_order, status,
  title, description, project_status, location, scope
) values (
  'industrial-plant', '/media/projects/industrial-plant-shell.jpg', 'industrial', '2026', '12,400 m²', true, 1, 'published',
  '{"en":"Precast industrial production shell","ka":"პრეკასტ ინდუსტრიული საწარმოო კარკასი"}'::jsonb,
  '{"en":"A factory shell planned around precast wall panels, structural concrete elements, and clean logistics for fast installation.","ka":"ქარხნის კარკასი, რომელიც დაგეგმილია კედლის პანელებზე, სტრუქტურულ ბეტონის ელემენტებზე და სწრაფი მონტაჟისთვის სუფთა ლოგისტიკაზე."}'::jsonb,
  '{"en":"Completed","ka":"დასრულებული"}'::jsonb,
  '{"en":"Georgia","ka":"საქართველო"}'::jsonb,
  '{"en":"Wall panels, columns, installation coordination","ka":"კედლის პანელები, სვეტები, მონტაჟის კოორდინაცია"}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  year = excluded.year,
  metric = excluded.metric,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  title = excluded.title,
  description = excluded.description,
  project_status = excluded.project_status,
  location = excluded.location,
  scope = excluded.scope;


insert into public.website_projects (
  slug, image_url, category_key, year, metric, featured, sort_order, status,
  title, description, project_status, location, scope
) values (
  'residential-block', '/media/projects/residential-precast-block.jpg', 'residential', '2025', '84 units', false, 2, 'published',
  '{"en":"Residential precast building system","ka":"საცხოვრებელი პრეკასტ სამშენებლო სისტემა"}'::jsonb,
  '{"en":"A repeatable housing structure using factory-made concrete elements to reduce on-site work and stabilize construction timing.","ka":"გამეორებადი საცხოვრებელი სტრუქტურა ქარხნულად დამზადებული ბეტონის ელემენტებით, რომელიც ამცირებს ადგილზე სამუშაოებს და ასტაბილურებს მშენებლობის ვადებს."}'::jsonb,
  '{"en":"Completed","ka":"დასრულებული"}'::jsonb,
  '{"en":"Georgia","ka":"საქართველო"}'::jsonb,
  '{"en":"Structural shell, stair elements, facade-ready panels","ka":"სტრუქტურული კარკასი, კიბის ელემენტები, ფასადისთვის მზად პანელები"}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  year = excluded.year,
  metric = excluded.metric,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  title = excluded.title,
  description = excluded.description,
  project_status = excluded.project_status,
  location = excluded.location,
  scope = excluded.scope;


insert into public.website_projects (
  slug, image_url, category_key, year, metric, featured, sort_order, status,
  title, description, project_status, location, scope
) values (
  'commercial-facade', '/media/projects/commercial-wall-panels.jpg', 'commercial', '2025', '1,860 panels', false, 3, 'published',
  '{"en":"Commercial wall panel package","ka":"კომერციული კედლის პანელების პაკეტი"}'::jsonb,
  '{"en":"Architectural and structural concrete wall panels prepared for a clean commercial exterior and efficient enclosure sequence.","ka":"არქიტექტურული და სტრუქტურული ბეტონის კედლის პანელები სუფთა კომერციული ექსტერიერისა და ეფექტური დახურვის პროცესისთვის."}'::jsonb,
  '{"en":"Delivered","ka":"მიწოდებული"}'::jsonb,
  '{"en":"Georgia","ka":"საქართველო"}'::jsonb,
  '{"en":"Precast panels, openings, transport planning","ka":"პრეკასტ პანელები, ღიობები, ტრანსპორტირების დაგეგმვა"}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  year = excluded.year,
  metric = excluded.metric,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  title = excluded.title,
  description = excluded.description,
  project_status = excluded.project_status,
  location = excluded.location,
  scope = excluded.scope;


insert into public.website_projects (
  slug, image_url, category_key, year, metric, featured, sort_order, status,
  title, description, project_status, location, scope
) values (
  'medical-extension', '/media/projects/medical-facility-extension.jpg', 'institutional', '2024', '3 phases', false, 4, 'published',
  '{"en":"Medical facility extension","ka":"სამედიცინო ობიექტის გაფართოება"}'::jsonb,
  '{"en":"A phased institutional extension using precast components to maintain predictable site access and disciplined delivery.","ka":"ეტაპობრივი ინსტიტუციური გაფართოება პრეკასტ კომპონენტებით, რათა ობიექტზე წვდომა და მიწოდების პროცესი პროგნოზირებადი დარჩეს."}'::jsonb,
  '{"en":"Completed","ka":"დასრულებული"}'::jsonb,
  '{"en":"Georgia","ka":"საქართველო"}'::jsonb,
  '{"en":"Structural components, phased installation, coordination","ka":"სტრუქტურული კომპონენტები, ეტაპობრივი მონტაჟი, კოორდინაცია"}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  year = excluded.year,
  metric = excluded.metric,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  title = excluded.title,
  description = excluded.description,
  project_status = excluded.project_status,
  location = excluded.location,
  scope = excluded.scope;

