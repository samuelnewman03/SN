################################################################################
##
## [ PROJ ] < College In vs. Out of State & Future Income  >
## [ AUTH ] < Sam Newman / samuelnewman03 >
## [ INIT ] < January 16, 2023 >
##
################################################################################

## ---------------------------
## libraries
## ---------------------------
library(tidyverse)
library(readxl) #to read excel files
library(labelled)
library(stringr)
library(ggplot2)

## ---------------------------
## directory paths
## ---------------------------

#create files
dir.create(path ="C:/Users/samue/OneDrive/Desktop/Grad School/Year 1/R/Q2 2023/Problem Sets/ps1_directory/data")
dir.create(path ="C:/Users/samue/OneDrive/Desktop/Grad School/Year 1/R/Q2 2023/Problem Sets/ps1_directory/analysis")
dir.create(path ="C:/Users/samue/OneDrive/Desktop/Grad School/Year 1/R/Q2 2023/Problem Sets/ps1_directory/analysis/plots")
dir.create(path ="C:/Users/samue/OneDrive/Desktop/Grad School/Year 1/R/Q2 2023/Problem Sets/ps1_directory/analysis/files")

#create reference directories to save time
input_data_dir  <- file.path(".", 'data')
output_plot_dir <- file.path(".", 'analysis', 'plots')
output_file_dir <- file.path(".", 'analysis', 'files')

#Check working directory
getwd()
#ANSWER: "C:/Users/samue/OneDrive/Desktop/Grad School/Year 1/R/Q2 2023/Problem Sets/ps1_directory"

#Check files in working directory 
list.files()
#ANSWER: "analysis"  "data"    "Newman_Sam_ps1.R"   "Problem Sets.Rproj"

#list files in working directory
list.files(path ="C:/Users/samue/OneDrive/Desktop/Grad School/Year 1/R/Q2 2023/Problem Sets/ps1_directory/analysis")
#ANSWER: "files" "plots"

#download data from URL link
download.file("https://github.com/anyone-can-cook/rclass2/raw/main/data/ps2_files.zip",  
              file.path(input_data_dir, "ps2files.zip"))

#unzip data 
unzip(zipfile = file.path(input_data_dir, 'ps2files.zip' ), exdir = input_data_dir) #exdir tells R where to place the extracted files

#check to see if unzipped files were saved in the correct location
list.files(path = input_data_dir)
#ANSWER: [1] "college_scorecard.csv" "college_scorecard_dict.xlsx" "ps2files.zip"  

#read in df
college_scorecard_df <- read_csv(file = file.path(input_data_dir, "college_scorecard.csv"),
    col_types = cols(control = col_integer()), 
    na = ".")

#read in 2nd df & assign column names
college_scorecard_dict <- read_excel(file.path(input_data_dir, 'college_scorecard_dict.xlsx'),
    sheet = 'institution_data_dictionary', 
    skip = 1, 
    col_names = c('var_label', 'category', 'dev_name', 'data_type', 'var_name', 'val_name', 'val_label', 'source', 'notes'))

#Investigate df
names(college_scorecard_df)
#[1] "instnm" [2] "control" [3] "tuitionfee_in" [4] "tuitionfee_out" [5] "md_earn_wne_p10"

str(college_scorecard_dict$var_name)
# chr [1:2301] "UNITID" "OPEID" "OPEID6" "INSTNM" "CITY" "STABBR" "ZIP" ...

#subset dfs
college_scorecard_dict_subset <- college_scorecard_dict %>%  
  dplyr::select(var_name, var_label, val_name, val_label) %>%  
  dplyr::mutate(var_name = str_to_lower(var_name)) 

 
college_scorecard_dict_subset <- college_scorecard_dict_subset %>%   
  dplyr::filter(var_name %in% c("instnm", "control", "tuitionfee_in", "tuitionfee_out", "md_earn_wne_p10"))
  
## Subset and rename variables 
college_scorecard_df_analysis <- college_scorecard_df  %>% 
    set_variable_labels(
    instnm = 'Institution Name',
    control = 'Control of institution',
    tuitionfee_in = 'In-state tuition and fees',
    tuitionfee_out = 'Out-of-state tuition and fees',
    md_earn_wne_p10 = 'Median earnings of students working and not enrolled 10 years after entry') %>%  
    set_value_labels(control = c('Public' = 1, 'Private nonprofit' = 2, 'Private for-profit' =3 ))

## Create variable  (1: Public, 2: Private)
college_scorecard_df_analysis <- college_scorecard_df_analysis %>%  
  mutate(school_type = if_else(control == 1, 1, 2))
                         
## Number 4: Plots

# Plot relationship between out-of-state tuition and median earnings
png(file.path(output_plot_dir, 'out_of_state_tuition_earnings.png'))
ggplot(college_scorecard_df_analysis, aes(x = tuitionfee_out, y = md_earn_wne_p10, color = as.factor(school_type))) +
  geom_point() +
  geom_smooth() +
  scale_color_discrete(name = 'School Type', labels = c('Public', 'Private')) +
  xlab('Tuition (Out-of-State)') + ylab('Earnings 10 years after completion')
dev.off()

# Plot relationship between in-state tuition and median earnings
png(file.path(output_plot_dir, 'in_state_tuition_earnings.png'))
ggplot(college_scorecard_df_analysis, aes(x = tuitionfee_in, y = md_earn_wne_p10, color = as.factor(school_type))) +
  geom_point() +
  geom_smooth() +
  scale_color_discrete(name = 'School Type', labels = c('Public', 'Private')) +
  xlab('Tuition (In-State)') + ylab('Earnings 10 years after completion')
dev.off()


#Check to see if plots were saved in the correct locations. 
list.files(output_plot_dir)
#ANSWER: [1] "in_state_tuition_earnings.png"  , "out_of_state_tuition_earnings.png"

## -----------------------------------------------------------------------------
## END SCRIPT
## -----------------------------------------------------------------------------
