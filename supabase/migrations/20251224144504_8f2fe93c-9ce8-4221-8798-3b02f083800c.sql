-- Create provider_gallery table for promotional photos
CREATE TABLE public.provider_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.provider_gallery ENABLE ROW LEVEL SECURITY;

-- Policies: Providers can manage their own gallery
CREATE POLICY "Providers can manage own gallery"
ON public.provider_gallery
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE providers.id = provider_gallery.provider_id
    AND providers.user_id = auth.uid()
  )
);

-- Everyone can view gallery of active providers
CREATE POLICY "Everyone can view provider galleries"
ON public.provider_gallery
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE providers.id = provider_gallery.provider_id
    AND providers.is_active = true
  )
);

-- Admins can manage all galleries
CREATE POLICY "Admins can manage all galleries"
ON public.provider_gallery
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for provider gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-gallery', 'provider-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for provider gallery
CREATE POLICY "Providers can upload to own gallery folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'provider-gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view provider gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'provider-gallery');

CREATE POLICY "Providers can delete own gallery images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'provider-gallery'
  AND auth.uid()::text = (storage.foldername(name))[1]
);