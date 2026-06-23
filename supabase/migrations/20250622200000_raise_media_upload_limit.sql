-- Raise website-media bucket limit for larger media center uploads.

update storage.buckets
set file_size_limit = 26214400
where id = 'website-media';
