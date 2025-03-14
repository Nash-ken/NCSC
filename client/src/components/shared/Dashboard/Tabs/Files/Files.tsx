import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FilesDataTable } from "@/components/shared/Tables/Dtable";
import { MediaFile } from "@/lib/dal";
import FilesHeader from "./FilesHeader";

export const Files = ({files}: { files: MediaFile[] }) => {
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row">
       <FilesHeader />
      </CardHeader>
      <CardContent className="space-y-2">
        <FilesDataTable files={files}/>
      </CardContent>
    </Card>
  );
};
